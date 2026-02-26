"use client";

import { motion } from "framer-motion";
import InnerHero from "@/components/common/InnerHero";
import CertificationSlider from "@/components/common/CertificationSlider";

interface PrivacyPolicyClientProps {
    lang: string;
}

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
};

export default function PrivacyPolicyClient({ lang }: PrivacyPolicyClientProps) {
    const isAr = lang === 'ar';

    const content = {
        en: {
            heroTitle: "Privacy Policy",
            heroDesc: "Our commitment to your privacy and data protection",
            breadcrumbCurrent: "Privacy Policy"
        },
        ar: {
            heroTitle: "سياسة الخصوصية",
            heroDesc: "التزامنا بخصوصيتك وحماية بياناتك",
            breadcrumbCurrent: "سياسة الخصوصية"
        }
    };

    const t = content[lang as keyof typeof content] || content.en;

    return (
        <div className="min-h-screen bg-background">
            <InnerHero
                title={t.heroTitle}
                description={t.heroDesc}
                backgroundImage="/images/slider/hero-authentic-argan-oil.webp"
                breadcrumbs={[
                    { label: isAr ? "الصفحة الرئيسية" : "Home", href: `/${lang}` },
                    { label: isAr ? "أورغانيكا" : "Organica", href: `/${lang}/organica` },
                    { label: t.breadcrumbCurrent },
                ]}
            />

            <section className="py-16 md:py-24" dir={isAr ? "rtl" : "ltr"}>
                <div className="container-main max-w-4xl mx-auto">
                    <motion.div className="rich-text-content" {...fadeInUp}>
                        <h1>Organica Group Privacy Policy</h1>
                        <p>
                            Organica Group proposes its ranges of products through its platform "moroccanorganica.com " "we", "us" or the "Company" is committed to guarantee the privacy protection. We understand the importance of keeping personal information private and secure. This policy describes generally how we manage personal information. If you would like more information, please don't hesitate to contact us.
                        </p>

                        <h4>Organica Group Privacy Principles</h4>
                        <p>
                            This Privacy Policy forms part of use termes and conditions as following : -We care about your privacy: -We will never rent, trade or sell your email address to anyone. -We will never publicly display your email address or other personal details that identify you except as outlined in this privacy policy. -We will treat all personal information in accordance with any and all obligations that are binding upon us under the Privacy Laws in Morocco. The Privacy Law lays down 13 key principles in relation to the collection and treatment of personal information.
                        </p>

                        <h4>What is personal information?</h4>
                        <p>
                            Personal information held by the Company may include your: -Name and date of birth; -Residential and business postal addresses, telephone/mobile/fax numbers and email addresses; -Bank account and/or credit card details for agreed billing purposes; -Any information that you provided to us during your account creation process, signing up to Organica Group.com E-news or added to your user profile; or preferences and password for using this site.
                        </p>

                        <h4>Information provided to PayPal</h4>
                        <p>
                            All purchases that are made through this website are processed securely and externally by PayPal. Unless you expressly consent otherwise, we do not see or have access to any personal information that you may provide to PayPal, other than information that is required in order to process your order and deliver your purchased services (eg, your name, email address and billing/postal address).
                        </p>

                        <h4>How we may collect your personal information?</h4>
                        <p>
                            At this website, we only collect personal information that is necessary for us to conduct our business related to distributing a range of professional hair care, skin care and cosmetics.
                        </p>

                        <h4>Information that you provide to us :</h4>
                        <p>
                            We may collect personal information that you provide to us about yourself when you use this website, including (without limitation) when you: -Create a user account; -Add information to your user profile; -Purchase the products and services through the platform of Organica Group.com ; -Add reviews, forum or chat room messages or comments in any elements of this website that permit user-generated content; - Register or sign up to Organica Group.comE-news; or -Complete an online contact form to contact us. -Provide information to us by telephone or through marketing or any application forms; -Provide information to us at any event, expo or showcase; or send us an email or other communication.
                        </p>

                        <h4>Sensitive Information :</h4>
                        <p>
                            We may collect sensitive information when you sign up for Organica Group.com E-news. You may consent or reject to provide them when you sign up. The Company collects this sensitive information in order to promote and market specific products and services to you based on the details you have provided. This website may also collect Internet Protocol (IP) addresses. IP addresses are assigned to computers on the internet to uniquely identify them within the global network. The Company collects and manages IP addresses as part of the service of providing internet session management and for security purposes. The Company may also collect and use web log, computer and connexion data for security purposes and to prevent and detect any misuse or fraudulent activities involving, this website.
                        </p>

                        <h4>Cookies :</h4>
                        <p>
                            This website uses "cookies" to personalize your online experience. A cookie is a text file or a packet of information that is placed on your hard desk by a web page server to identify and interact more effectively with your computer. There are two types of cookies that may be used at this site: a persistent cookie and a session cookie. A persistent cookie is entered by your web browser into the "Cookies" folder on your computer and remains in that folder after you close your browser, and may be used by your browser on subsequent visits to this site. A session cookie is held temporarily in your computer’s memory and disappears after you close your browser or shut down your computer. Cookies cannot be used to run programs. Cookies are uniquely assigned to you, and can only be read by a web server in the domain that issued the cookie. In some cases, cookies may collect and store personal information about you. The Company extends the same privacy protection to your personal information, whether gathered via cookies or from other sources. You can configure your internet browser to accept all cookies, reject all cookies or notify you when a cookie is sent. Please refer to your internet browser’s instructions to learn more about these functions. Most web browsers automatically accept cookies, but you can usually modify your browser settings to decline cookies if you prefer. If you choose to decline cookies, you may not be able to fully experience the interactive features of this website.
                        </p>

                        <h4>Why we use cookies ?</h4>
                        <p>
                            This site uses cookies in order to: -Remember your preferences for using this site; -Manage the signup process when you create an account with us; -Recognize you as logged in while you remain so. This avoids your having to log in again every time you visit a new page; -Facilitate e-commerce transactions, to ensure that your order is remembered between pages during the checkout process; -Show relevant notifications to you (eg, notifications that are relevant only to users who have, or have not, created an account or subscribed to newsletters or email or other subscription services); and -Remember details of data that you choose to submit to us (eg, through online contact forms or by way of comments, forum posts, chat room messages, reviews, ratings, etc). Many of these cookies are removed or cleared when you log out but some may remain so that your preferences are remembered for future sessions.
                        </p>

                        <h4>Third party cookies</h4>
                        <p>
                            In some cases, third parties may place cookies through this website. For example: -Google Analytics, one of the most widespread and trusted website analytics solutions, may use cookies to identified data about how long users spend on this site and the pages that they visit; -Google AdSense, one of the most widespread and trusted website advertising solutions, may use cookies to serve more relevant advertisements across the web and limit the number of times that a particular advertisement is shown to you; -And third party social media applications (eg, Facebook, Twitter, LinkedIn, Pinterest, YouTube, Instagram, etc) may use cookies in order to facilitate various social media buttons and/or plugins in this site.
                        </p>

                        <h4>How we may use your personal information ? </h4>
                        <p>
                            Your personal information may be used in order to: -Verify your identity; -Assist you to place orders through this site; -Process any purchases of services that you may make through this site, -Process any disputes or refunds related to any purchases of services that you have made through the site of Organica Group.com; -Make changes to your account; -Respond to any queries or feedback that you may have; -Conduct appropriate checks for credit-worthiness and for fraud; -Prevent and detect any misuse or fraudulent activities involving, this site; -Conduct research and development in respect of our services; -Provide you with Organica Group.com E-news if you have signed up to receive it; -Gain an understanding of your information and communication needs or obtain your feedback or opinions about our services in order for us to improve them; and/or maintain and develop our business systems and infrastructure, including testing and upgrading of these systems. -And for any other purpose reasonably considered necessary or desirable by the Company in relation to the operation of our business. From time to time we may email our customers with news, information and offers relating to our own services. Your personal information may also be collected so that the Company can promote and market products and services to you.This is to keep you informed, of products, services, and special offers we believe you will find valuable and may continue after you cease acquiring services from us . If you would prefer not to receive promotional or other material from us, please let us know and we will respect your request. You can unsubscribe from our communications at any time if you decide so.
                        </p>

                        <h4>Information provided to a third party</h4>
                        <p>
                            When you acquire or access any other services from a third party through this site, we will provide to that third party such information as is necessary to enable it to process and administer your order. Such information will include personal data about you, including (without limitation) your name and contact details.
                        </p>

                        <h4>Information provided to independent contractors of moroccanorganica.com</h4>
                        <p>
                            We may disclose your personal information to independent contractors of moroccanorganica.com. The Company takes reasonable steps to ensure that these organizations are bound by confidentiality, privacy and other contractual obligations in relation to the protection of your personal information. These independent contractors may be provided your information to carry out or provide services, assist you to place orders including through this site, process any disputes or refunds you have in relation to any purchases of products and servicess that you have made including through this site; and respond to any queries or feedback that you may have. We may also disclose your personal information to independent contractors of moroccanorganica.com for the purpose of sales and account reporting.
                        </p>

                        <h4>Information provided to other organizations :</h4>
                        <p>
                            In order to deliver the services you require or for the purposes set out above, the Company may disclose your personal information to organizations outside the Company including independent contractors of moroccanorganica.com. Your personal information disclosed to these organizations only in relation to this site, and the Company takes reasonable steps to ensure that these organizations are bound by confidentiality and privacy obligations in relation to the protection of your personal information. These organizations may carry out or provide: -Customer enquiries; -Mailing systems; -Billing and debt-recovery functions; -Information technology services; -Marketing, telemarketing and sales services; -Market research; and Website usage analysis. In addition, we may disclose your personal information to: -Your authorized representatives or legal advisers (when requested by you to do so); -Credit-reporting and fraud-checking agencies; -Credit providers (for credit-related purposes such as creditworthiness, credit rating, credit provision and financing); -Our professional advisers, including our accountants, auditors and lawyers; -Government and regulatory authorities and other organizations, as required or authorized by law; -Organizations who manage our business strategies, including those involved in a transfer/sale of all or part of our assets or business (including accounts and trade receivables) and those involved in managing our business risk and funding functions; -The police or other appropriate persons where your communication suggests possible illegal activity or harm to others.
                        </p>

                        <h4>Contacting us about privacy</h4>
                        <p>
                            If you would like more information about the way we manage personal information that we hold about you, or are concerned that we may have breached your privacy, please contact us by email or by post.
                        </p>

                        <h4>Access to your personal information</h4>
                        <p>
                            In most cases, you may have access to personal information that we hold about you. We will handle requests for access to your personal information in accordance with the international Privacy Principles. All requests for access to your personal information must be directed to the Privacy Officer by email using the email address provided on our website or by writing to us at our postal address. We will deal with all requests for access to personal information as quickly as possible. Requests for a large amount of information, or information that is not currently in use may require further time before a response can be given. We may charge you a fee for access if a cost is incurred by us in order to retrieve your information, but in no case we will charge you a fee for your access application. In some cases, we may refuse to give you access to personal information that we hold about you. This may include circumstances where giving you access would: -Be unlawful (eg, where a record that contains personal information about you is subject to a claim for legal professional privilege by one of our contractual counterparties); -Have an unreasonable impact on another person’s privacy; or prejudice an investigation of unlawful activity. We may also refuse access where the personal information relates to existing or anticipated legal proceedings, and the information would not be accessible by the process of discovery in those proceedings. If we refuse to give you access, we will provide you with reasons for our refusal.
                        </p>

                        <h4>Correcting your personal information :</h4>
                        <p>
                            We will amend any personal information about you that is held by us and that is inaccurate, incomplete or out of date if you request us to do so. If we disagree with your point view about the accuracy completeness of a record of your personal information that is held by us, and you ask us to associate with that record a statement that you have a contrary view, we will take reasonable steps to do so.
                        </p>

                        <h4>Storage and security of your personal information.</h4>
                        <p>
                            We are committed to maintain the confidentiality of the information that you provide us and we will proceed according to international policies.
                        </p>
                    </motion.div>
                </div>
            </section>

            <CertificationSlider />
        </div>
    );
}
