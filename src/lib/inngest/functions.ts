import { inngest } from "@/lib/inngest/client";
import { NEWS_SUMMARY_EMAIL_PROMPT, PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./prompts";
import { sendNewsSummaryEmail, sendWelcomeEmail } from "@/lib/nodemailer";

import { getAllUsersForNewsEmail } from "@/lib/actions/user.actions";
import { getWatchlistSymbolsByEmail } from "../actions/watchlist.actions";
import { getNews } from "../actions/finnhub.actions";
import { getFormattedTodayDate } from "../utils";

export const sendSignUpEmail = inngest.createFunction(
    { id: 'sign-up-email' },
    { event: 'app/user.created'},
    async ({ event, step }) => {
        const userProfile = `
            - Country: ${event.data.country}
            - Investment goals: ${event.data.investmentGoals}
            - Risk tolerance: ${event.data.riskTolerance}
            - Preferred industry: ${event.data.preferredIndustry}
        `

        const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace('{{userProfile}}', userProfile)

        const response = await step.ai.infer('generate-welcome-intro', {
            model: step.ai.models.openai({ model: 'gpt-4o-mini' }),
            body: {
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            }
        })

        await step.run('send-welcome-email', async () => {
            const introText = response.choices?.[0]?.message?.content || 'Thanks for joining PaymentsCharts. You now have the tools to track markets and make smarter moves.'

            const { data: { email, name } } = event;

            return await sendWelcomeEmail({ email, name, intro: introText });
        })

        return {
            success: true,
            message: 'Welcome email sent successfully'
        }
    }
)


export const sendDailyNewsSummary = inngest.createFunction(
    { id: 'daily-news-summary' },
    [ { event: 'app/send.daily.news' }, { cron: '42 8 * * *' } ],
    async ({ step }) => {
        
        // step 1: get all users from news delivery
        const users = await step.run("get-all-users", getAllUsersForNewsEmail);

        if (!users.length || users.length === 0) return { success: false, message: "No users found for news email." };
        
        // Step 2: For each user, get watchlist symbols -> fetch news (fallback to general)

        const results = await step.run('fetch-user-news', async () => {
            const perUser: Array<{ user: UserForNewsEmail; articles: MarketNewsArticle[] }> = [];
            for (const user of users as UserForNewsEmail[]) {
                try {
                    const symbols = await getWatchlistSymbolsByEmail(user.email);
                    let articles = await getNews(symbols);
                    // Enforce max 6 articles per user
                    articles = (articles || []).slice(0, 6);
                    // If still empty, fallback to general
                    if (!articles || articles.length === 0) {
                        articles = await getNews();
                        articles = (articles || []).slice(0, 6);
                    }
                    perUser.push({ user, articles });
                } catch (e) {
                    console.error('daily-news: error preparing user news', user.email, e);
                    perUser.push({ user, articles: [] });
                }
            }
            return perUser;
        });


        // step 3: Summarize news via AI for each user
        const userNewsSummaries: { user: UserForNewsEmail; newsContent: string | null }[] = [];

        for (const { user, articles } of results) {
                try {
                    const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace('{{newsData}}', JSON.stringify(articles, null, 2));

                    const response = await step.ai.infer(`summarize-news-${user.email}`, {
                        model: step.ai.models.openai({ model: 'gpt-4o-mini' }),
                        body: {
                            messages: [
                                {
                                    role: 'user',
                                    content: prompt
                                }
                            ]
                        }
                    });

                    const newsContent = response.choices?.[0]?.message?.content || 'No market news.'

                    userNewsSummaries.push({ user, newsContent });
                } catch (e) {
                    console.error('Failed to summarize news for : ', user.email);
                    userNewsSummaries.push({ user, newsContent: null });
                }
            }

        // step 4: Send emails 
        await step.run('send-news-emails', async () => {
                await Promise.all(
                    userNewsSummaries.map(async ({ user, newsContent}) => {
                        if(!newsContent) return false;

                        return await sendNewsSummaryEmail({ email: user.email, date: getFormattedTodayDate(), newsContent })
                    })
                )
            })
            return { success: true, message: 'Daily news summary emails sent successfully' }

    }
    
)