"use client";

import { motion } from "framer-motion";
import InnerHero from "@/components/common/InnerHero";
import CertificationSlider from "@/components/common/CertificationSlider";

interface TermsConditionsClientProps {
    lang: string;
}

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
};

export default function TermsConditionsClient({ lang }: TermsConditionsClientProps) {
    const isAr = lang === 'ar';

    const content = {
        en: {
            heroTitle: "Terms & Conditions",
            heroDesc: "General conditions for using Organica Group services",
            breadcrumbCurrent: "Terms & Conditions",
            section2: (
                <>
                    <p>This agreement was written in English. To the extent any translated version of this agreement conflicts with the English version. Date of Last Revision: February, 7, 2018.</p>

                    <h4>Statement of Rights and Responsibilities</h4>
                    <p>This Statement of Rights and Responsibilities ("Statement," "Terms," or "SRR") derives from the moroccanorganica.com, and is our terms of service that governs our relationship with users and others who interact with moroccanorganica.com, as well as our brands and services, which we promote through moroccanorganica.com, you agree to this statement, as updated from time to time in accordance with sections below. Additionally, you will find resources at the end of this document that help you to understand how moroccanorganica.com works.</p>

                    <h4>PRIVACY</h4>
                    <p>Please review our Privacy Notice, which also governs your visit to our website, to understand our practices.</p>

                    <h4>ELECTRONIC COMMUNICATIONS</h4>
                    <p>When you visit moroccanorganica.com or send e-mails to us, you consent to receive communications from us electronically. We will communicate with you by e-mail or by posting notices on this website. You agree that all agreements, notices, disclosures and other communications that we provide to you electronically satisfy any legal requirement.</p>

                    <h4>COPYRIGHT</h4>
                    <p>All content included on this website, such as text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and softwares, is the property of moroccanorganica.com or its content suppliers and protected by international copyright laws. The compilation of all content on this site is the exclusive property of moroccanorganica.com, with copyright rights and protected by international copyright laws.</p>

                    <h4>TRADE MARKS</h4>
                    <p>moroccanorganica.com trademarks and trade dress may not be used in connection with any product or service that is not moroccan organica ’s, in any manner that is likely to cause confusion among customers, or in any manner that disparages or discredits moroccanorganica.com. All other trademarks not owned by moroccan organica or its subsidiaries that appear on this site are the property of their respective owners, who may or may not be affiliated with, connected to, or sponsored by moroccan organica or its subsidiaries.</p>

                    <h4>LICENSE AND SITE ACCESS</h4>
                    <p>moroccanorganica.com grants you a limited license to access and make personal use of this site and not to download (other than page caching) or modify it totally or partially, except with express written consent of moroccan organica . This license does not include any resale or commercial use of this site or its contents: any collection and use of any services and product listings, descriptions, or prices: any derivative use of this site or its contents: any downloading or copying of account information for the benefit of another merchant: or any use of data mining, robots, or similar data gathering and extraction tools. This site or any portion of this site may not be reproduced, duplicated, copied, sold, resold, or otherwise exploited for any commercial purpose without express written consent of moroccan organica . You may not frame or use framing techniques to enclose any trademark, logo, or other proprietary information (including images, text, page layout, or form) of moroccanorganica.com and our associates without express written consent. You may not use any meta tags or any other "hidden text" using moroccan organica ‘s name or trademarks without the express written consent of moroccan organica . Any unauthorized use terminates the permission or license granted by moroccanorganica.com. You are granted a limited, revocable, and nonexclusive right to create a hyperlink to the home page of moroccanorganica.com so long as the link does not portray moroccan organica , its associates, or their products or services in a false, misleading, derogatory, or otherwise offensive matter. You may not use any moroccan organica logo or other proprietary graphic or trademark as part of the link without express written permission.</p>

                    <h4>YOUR MEMBERSHIP ACCOUNT</h4>
                    <p>If you use this site, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer, and you agree to accept responsibility for all activities that occur under your account or password. If you are under 18 years old, you may use our website only with involvement of a parent or guardian. moroccan organica and its associates reserve the right to refuse service, terminate accounts, remove or edit content, or cancel orders in their own discretion.</p>
                </>
            ),
            section1: (
                <>
                    <h4>REVIEWS, COMMENTS, EMAILS, AND OTHER CONTENTS</h4>
                    <p>Visitors may post reviews, comments, and other contents: and submit suggestions, ideas, comments, questions, or other information, as long as the content is not illegal, obscene, threatening, defamatory, invasive of privacy, infringing of intellectual property rights, or otherwise injurious to third parties or objectionable and does not consist of or contain software viruses, political campaigning, commercial solicitation, chain letters, mass mailings, or any form of "spam." You may not use a false e-mail address, impersonate any person or entity, or otherwise mislead as to the origin of a card or other content. moroccanorganica.com reserves the right (but not the obligation) to remove or edit such content, but does not regularly review posted content. If you do post content or submit material, and unless we indicate otherwise, you grant moroccan organica and its associates a nonexclusive, royalty-free, perpetual, irrevocable, and fully sub-licensable right to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such content throughout the world in any media. You grant moroccan organica and its associates and sub-licensees the right to use the name that you submit in connexion with such content, if they choose. You represent and warrant that you own or otherwise control all of the rights to the content that you post: that the content is accurate: that use of the content you supply does not violate this policy and will not cause injury to any person or entity: and that you will indemnify moroccan organica or its associates for all claims resulting from content you supply. moroccanorganica.com has the right but not the obligation to monitor and edit or remove any activity or content. moroccanorganica.com takes no responsibility and assumes no liability for any content posted by you or any third party.</p>

                    <h4>SERVICE DESCRIPTIONS</h4>
                    <p>moroccanorganica and its associates attempt to be as accurate as possible. However, moroccanorganica .com does not warrant that products or services descriptions or other content of this site as complete, reliable, current, or error-free. If a service offered by moroccanorganica .com itself is not as described, you may declared in unused condition. DISCLAIMER OF WARRANTIES AND LIMITATION OF LIABILITY THIS SITE IS PROVIDED BY moroccanorganica ON AN "AS IS" AND "AS AVAILABLE" BASIS. moroccanorganica .COM MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE OPERATION OF THIS SITE OR THE INFORMATION, CONTENT, MATERIALS, OR SERVICES INCLUDED ON THIS SITE. YOU EXPRESSLY AGREE THAT YOUR USE OF THIS SITE IS AT YOUR SOLE RISK. TO THE FULL EXTENT PERMISSIBLE BY APPLICABLE LAW, moroccanorganica .COM DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. moroccanorganica .COM DOES NOT WARRANT THAT THIS SITE, ITS SERVERS, OR E-MAIL SENT FROM moroccanorganica .COM ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS. moroccanorganica WILL NOT BE LIABLE FOR ANY DAMAGES OF ANY KIND ARISING FROM THE USE OF THIS SITE, INCLUDING, BUT NOT LIMITED TO DIRECT, INDIRECT, INCIDENTAL, PUNITIVE, AND CONSEQUENTIAL DAMAGES. CERTAIN STATE LAWS DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES OR THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES. IF THESE LAWS APPLY TO YOU, THE ABOVE DISCLAIMERS, EXCLUSIONS, OR LIMITATIONS MAY NOT APPLY TO YOU, AND YOU MIGHT HAVE ADDITIONAL RIGHTS.</p>

                    <h4>APPLICABLE LAW</h4>
                    <p>By visiting moroccanorganica .com, you agree that the laws of Morocco without regard to principles of conflict of laws, will govern these Conditions of Use and any dispute of any sort that might arise between you and moroccanorganica or its associates.</p>

                    <h4>DISPUTES</h4>
                    <p>Any dispute relating in any way to your visit to moroccanorganica or to services and products you purchase through moroccanorganica .com shall be submitted to confidential arbitration in Morocco, except that, to the extent you have in any manner violated or threatened to violate moroccanorganica ’s intellectual property rights, moroccanorganica may seek injunctive or other appropriate relief in any court in Morocco, and you consent to exclusive jurisdiction and venue in such courts. Arbitration under this agreement shall be conducted under the rules then prevailing of the Moroccan Arbitration. The arbitrators award shall be binding and may be entered as a judgment in any court of competent jurisdiction. To the fullest extent permitted by applicable law, no arbitration under this Agreement shall be joined to an arbitration involving any other party subject to this Agreement, whether through class arbitration proceedings or otherwise.</p>

                    <h4>SITE POLICIES, MODIFICATION, AND SEVERABILITY</h4>
                    <p>Please review our other policies, posted on this site. These policies also govern your visit to moroccanorganica .com. We reserve the right to make changes to our site, policies, and these Conditions of Use at any time. If any of these conditions shall be deemed invalid, void, or for any reason unenforceable, that condition shall be deemed severable and shall not affect the validity and enforceability of any remaining condition.</p>

                    <h4>QUESTIONS</h4>
                    <p>Questions regarding our Conditions of Use, Privacy Policy, or other policy related material can be directed to our support staff by clicking on the "Contact Us" link in the Customer Service. Or you can email us at: info@moroccanorganica .com</p>
                </>
            )
        },
        ar: {
            heroTitle: "الشروط والأحكام",
            heroDesc: "الشروط العامة لاستخدام خدمات مجموعة Organica",
            breadcrumbCurrent: "الشروط والأحكام الخاصة بنا",
            section2: (
                <>
                    <p><bdi>تمت كتابة هذه الاتفاقية باللغة الإنجليزية. إلى الحد الذي تتعارض فيه أي نسخة مترجمة من هذه الاتفاقية مع النسخة الإنجليزية. تاريخ آخر مراجعة: 7 فبراير 2018.</bdi></p>
                    <h4>بيان الحقوق والمسؤوليات</h4>
                    <p><bdi>بيان الحقوق والمسؤوليات هذا (البيان أو الشروط أو SRR) مشتق من موقع moroccanorganica.com ، كما أن شروط الخدمة لدينا تحكم علاقتنا بالمستخدمين وغيرهم ممن يتفاعلون مع موقع moroccanorganica.com. بصفتك علاماتنا التجارية وخدماتنا ، التي نروج لها من خلال moroccanorganica.com ، فإنك توافق على هذا البيان ، كما يتم تحديثه من وقت لآخر وفقًا للأقسام أدناه. بالإضافة إلى ذلك ، ستجد موارد في نهاية هذا المستند تساعدك على فهم كيفية عمل موقع moroccanorganica.com.</bdi></p>
                    <h4>الإجمالية</h4>
                    <p><bdi>يرجى مراجعة إشعار الخصوصية الخاص بنا ، والذي يحكم أيضًا زيارتك لموقعنا على الويب ، لفهم ممارساتنا.</bdi>
                    </p>
                    <h4>الاتصالات الإلكترونية</h4>
                    <p><bdi>عند زيارة موقع moroccanorganica.com أو إرسال رسائل بريد إلكتروني إلينا ، فإنك توافق على تلقي اتصالات منا إلكترونيًا. سوف نتواصل معك عن طريق البريد الإلكتروني أو عن طريق نشر الإخطارات على هذا الموقع. أنت توافق على أن جميع الاتفاقيات والإشعارات والإفصاحات وغيرها من الاتصالات التي نقدمها لك إلكترونيًا تفي بأي متطلبات قانونية.</bdi>
                    </p>
                    <h4>حقوق النشر</h4>
                    <p><bdi>جميع المحتويات المضمنة في هذا الموقع ، مثل النصوص والرسومات والشعارات وأيقونات الأزرار والصور ومقاطع الصوت والتنزيلات الرقمية وتجميعات البيانات والبرامج ، هي ملك لموقع moroccanorganica.com أو موردي محتوياته ومحمي بموجب قوانين حقوق النشر الدولية. تجميع كافة المحتويات على هذا الموقع هو ملكية حصرية لموقع moroccanorganica.com ، مع حقوق التأليف والنشر والمحمية بقوانين حقوق النشر الدولية.</bdi>
                    </p>
                    <h4>العلامات التجارية</h4>
                    <p><bdi>لا يجوز استخدام العلامات التجارية والمظهر التجاري الخاص بموقع moroccanorganica.com فيما يتعلق بأي منتج أو خدمة غير عضوية مغربية ، بأي طريقة من المحتمل أن تسبب ارتباكًا بين العملاء ، أو بأي طريقة تحط من قدر موقع moroccanorganica.com أو تشوه سمعته. جميع العلامات التجارية الأخرى غير المملوكة لشركة moroccan organica أو الشركات التابعة لها والتي تظهر على هذا الموقع هي ملك لأصحابها المعنيين ، الذين قد يكونوا أو لا ينتمون أو مرتبطين أو مدعومين من شركة moroccan organica أو الشركات التابعة لها.</bdi>
                    </p>
                    <h4>الترخيص والوصول إلى الموقع</h4>
                    <p><bdi>يمنحك موقع moroccanorganica.com ترخيصًا محدودًا للوصول إلى هذا الموقع واستخدامه بشكل شخصي وعدم تنزيله (بخلاف التخزين المؤقت للصفحة) أو تعديله كليًا أو جزئيًا ، إلا بموافقة خطية صريحة من Organica المغربية. لا يتضمن هذا الترخيص أي إعادة بيع أو استخدام تجاري لهذا الموقع أو محتوياته: أي جمع واستخدام أي خدمات وقوائم المنتجات أو الأوصاف أو الأسعار: أي استخدام مشتق لهذا الموقع أو محتوياته: أي تنزيل أو نسخ لمعلومات الحساب لصالح تاجر آخر: أو أي استخدام لاستخراج البيانات أو الروبوتات أو أدوات مماثلة لجمع البيانات واستخراجها. لا يجوز إعادة إنتاج هذا الموقع أو أي جزء منه أو نسخ أو نسخ أو بيعه أو إعادة بيعه أو استغلاله بأي شكل آخر لأي غرض تجاري دون موافقة خطية صريحة من Organica المغربية. لا يجوز لك تأطير أو استخدام تقنيات تأطير لإرفاق أي علامة تجارية أو شعار أو معلومات ملكية أخرى (بما في ذلك الصور أو النصوص أو تخطيط الصفحة أو النموذج) الخاصة بموقع moroccanorganica.com وشركائنا دون موافقة كتابية صريحة. لا يجوز لك استخدام أي علامات وصفية أو أي نص مخفي آخر باستخدام اسم Organica المغربي أو العلامات التجارية دون موافقة كتابية صريحة من moroccan organica. يؤدي أي استخدام غير مصرح به إلى إنهاء الإذن أو الترخيص الممنوح من موقع moroccanorganica.com. يتم منحك حقًا محدودًا وقابلًا للإلغاء وغير خصري لإنشاء ارتباط تشعبي للصفحة الرئيسية لموقع moroccanorganica.com طالما أن الرابط لا يصور العضوية المغربية أو شركائها أو منتجاتهم أو خدماتهم بطريقة خاطئة ومضللة ومهينة ، أو أمر مسيء بطريقة أخرى. لا يجوز لك استخدام أي شعار Organica المغربي أو أي رسم أو علامة تجارية مملوكة ملكية أخرى كجزء من الرابط دون إذن كتابي صريح.</bdi>
                    </p>
                    <h4>حساب عضويتك</h4>
                    <p><bdi>إذا كنت تستخدم هذا الموقع ، فأنت مسؤول عن الحفاظ على سرية حسابك وكلمة المرور وتقييد الوصول إلى جهاز الكمبيوتر الخاص بك ، وتوافق على قبول المسؤولية عن جميع الأنشطة التي تحدث تحت حسابك أو كلمة مرورك. إذا كان عمرك أقل من 18 عامًا ، فلا يجوز لك استخدام موقعنا الإلكتروني إلا بمشاركة أحد الوالدين أو الوصي. moroccan organica وشركاؤها يحتفظون بالحق في رفض الخدمة أو إنهاء الحسابات أو إزالة المحتوى أو تعديله أو إلغاء الطلبات وفقًا لتقديرهم الخاص.</bdi></p>
                </>
            ),
            section1: (
                <>
                    <h4>المراجعات والتعليقات والبريد الإلكتروني والمحتويات الأخرى</h4>
                    <p><bdi>يمكن للزوار نشر التعليقات والتعليقات والمحتويات الأخرى: وتقديم الاقتراحات والأفكار والتعليقات والأسئلة أو المعلومات الأخرى ، طالما أن المحتوى ليس غير قانوني أو فاحش أو تهديد أو تشهيري أو ينتهك الخصوصية أو ينتهك حقوق الملكية الفكرية ، أو إيذاء لأطراف أخرى أو مرفوض ولا تتكون من أو تحتوي على فيروسات برامج أو حملات سياسية أو طلبات تجارية أو رسائل متسنسلة أو رسائل بريدية جماعية أو أي شكل من أشكال "البريد العشوائي". لا يجوز لك استخدام عنوان بريد إلكتروني مزيف ، أو انتحال شخصية أي شخص أو كيان ، أو التضليل فيما يتعلق بأصل بطاقة أو محتوى آخر. يحتفظ موقع moroccanorganica.com بالحق (ولكن ليس الالتزام) في إزالة أو تحرير مثل هذا المحتوى ، لكنه لا يقوم بمراجعة المحتوى المنشور بانتظام. إذا قمت بنشر محتوى أو إرسال مادة ، وما لم نذكر خلاف ذلك ، فإنك تمنح Organica المغربية وشركائها حقًا غير حصري وخالي من حقوق الملكية ودائم وغير قابل للإلغاء وقابل للترخيص من الباطن بالكامل لاستخدام وإعادة إنتاج وتعديل وتكييف ونشر ، ترجمة وإنشاء أعمال مشتقة من هذا المحتوى وتوزيعه وعرضه في جميع أنحاء العالم في أي وسائط. أنت تمنح Organica المغربية وشركائها والمرخص لهم من الباطن الحق في استخدام الاسم الذي تقدمه فيما يتعلق بمثل هذا المحتوى ، إذا اختاروا ذلك. أنت تقر وتتعهد بأنك تمتلك أو تتحكم بطريقة أخرى في جميع حقوق المحتوى الذي تنشره: أن المحتوى دقيق: أن استخدام المحتوى الذي تقدمه لا ينتهك هذه السياسة ولن يتسبب في إصابة أي شخص أو كيان: وأنك ستقوم بتعويض شركة moroccan moroccan أو شركائها عن جميع المطالبات الناتجة عن المحتوى الذي تقدمه. moroccanorganica.com له الحق ولكن ليس الالتزام بمراقبة وتعديل أو إزالة أي نشاط أو محتوى. لا يتحمل موقع moroccanorganica.com أي مسؤولية ولا يتحمل أي مسؤولية عن أي محتوى تنشره أنت أو أي طرف ثالث.</bdi>
                    </p>
                    <h4>أوصاف الخدمة</h4>
                    <p><bdi>moroccanorganica وشركائها يحاولون أن يكونوا دقيقين قدر الإمكان. ومع ذلك ، فإن موقع moroccanorganica.com لا يضمن أن أوصاف المنتجات أو الخدمات أو المحتويات الأخرى لهذا الموقع كاملة أو موثوقة أو حديثة أو خالية من الأخطاء. إذا كانت الخدمة التي يقدمها موقع moroccanorganica.com نفسه ليست كما هو موصوف ، فيجوز لك الإعلان في حالة غير مستخدمة. إخلاء المسؤولية عن الضمانات وتحديد المسؤولية يتم توفير هذا الموقع من قبل moroccanorganica على أساس "كما هو" و "كما هو متاح". لا تقدم moroccanorganica .COM أي إقرارات أو ضمانات من أي نوع ، صريحة أو ضمنية ، فيما يتعلق بتشغيل هذا الموقع أو المعلومات أو المحتوى أو المواد أو الخدمات المتضمنة في هذا الموقع. أنت توافق صراحة على أن استخدامك لهذا الموقع يكون على مسؤوليتك وحدك. إلى الحد الأقصى الذي يسمح به القانون المعمول به ، تتنصل moroccanorganica.COM من جميع الضمانات ، الصريحة أو الضمنية ، بما في ذلك ، على سبيل المثال لا الحصر ، الضمانات الضمنية لقابلية التسويق والملاءمة لغرض معين. moroccanorganica .COM لا تضمن خلو هذا الموقع أو خوادمه أو البريد الإلكتروني المرسل من moroccanorganica .COM من الفيروسات أو المكونات الضارة الأخرى. لن تكون moroccanorganica مسؤولة عن أي أضرار من أي نوع تنشأ عن استخدام هذا الموقع ، بما في ذلك ، على سبيل المثال لا الحصر ، الأضرار المباشرة وغير المباشرة والعرضية والعقابية والتبعية. لا تسمح قوانين دولة معينة بفرض قيود على الضمانات الضمنية أو استثناء أو تحديد أضرار معينة. إذا كانت هذه القوانين تنطبق عليك ، فقد لا تنطبق عليك إخلاء المسؤولية أو الاستثناءات أو القيود المذكورة أعلاه ، وقد يكون لديك حقوق إضافية.</bdi>
                    </p>
                    <h4>القانون الواجب التطبيق</h4>
                    <p><bdi>من خلال زيارة موقع moroccanorganica.com ، فإنك توافق على أن قوانين المغرب ، بغض النظر عن مبادئ تنازع القوانين ، ستحكم شروط الاستخدام هذه وأي نزاع من أي نوع قد ينشأ بينك وبين moroccanorganica أو شركائها.</bdi>
                    </p>
                    <h4>النزاعات</h4>
                    <p><bdi>أي نزاع يتعلق بأي شكل من الأشكال بزيارتك إلى موقع moroccanorganica أو بالخدمات والمنتجات التي تشتريها عبر الموقع الإلكتروني moroccanorganica سيتم تقديمه إلى تحكيم سري في المغرب ، باستثناء ذلك ، إلى الحد الذي تكون قد انتهكت أو هددت بانتهاك موقع moroccanorganica بأي شكل من الأشكال. حقوق الملكية الفكرية ، قد تسعى moroccanorganica للحصول على أمر زجري أو أي تعويض مناسب آخر في أي محكمة في المغرب ، وأنت توافق على الاختصاص القضائي الحصري والمكان في هذه المحاكم. يتم التحكيم بموجب هذه الاتفاقية وفقًا للقواعد السائدة في ذلك الوقت للتحكيم المغربي. يجب أن يكون قرار المحكمين ملزمًا ويمكن إدخاله كحكم في أي محكمة ذات اختصاص قضائي. إلى أقصى حد يسمح به القانون المعمول به ، لا يجوز ضم أي تحكيم بموجب هذه الاتفاقية إلى أي تحكيم يشمل أي طرف آخر خاضع لهذه الاتفاقية ، سواء من خلال إجراءات التحكيم الجماعية أو غير ذلك.</bdi>
                    </p>
                    <h4>سياسات الموقع وتعديله وقابليته للفصل</h4>
                    <p><bdi>يرجى مراجعة سياسات أخرى لدينا المنشورة على هذا الموقع. هذه السياسات تحكم زيارتك لموقع moroccanorganica.com. نحتفظ بالحق في إجراء تغييرات على موقعنا وسياساتنا وشروط الاستخدام هذه في أي وقت. إذا تم اعتبار أي من هذه الشروط باطلاً أو باطلاً أو غير قابل للتنفيذ لأي سبب من الأسباب ، فسيتم اعتبار هذا الشرط قابلاً للفصل ولن يؤثر على صلاحية أي شرط متبقي وإمكانية تطبيقه.</bdi>
                    </p>
                    <h4>أسئلة</h4>
                    <p><bdi>يمكن توجيه الأسئلة المتعلقة بشروط الاستخدام أو سياسة الخصوصية أو غيرها من المواد ذات الصلة بالسياسة إلى فريق الدعم لدينا من خلال النقر على رابط "اتصل بنا" في خدمة العملاء. أو يمكنك مراسلتنا على: info @ moroccanorganica .com</bdi></p>
                </>
            )
        },
        fr: {
            heroTitle: "Conditions générales",
            heroDesc: "Conditions d'utilisation des services d'Organica Group",
            breadcrumbCurrent: "Conditions générales",
            section2: (
                <>
                    <p>Cet accord a été rédigé en anglais. En cas de conflit avec une version traduite, la version anglaise prévaut. Dernière révision : 7 février 2018.</p>
                    <h4>Déclaration des droits et responsabilités</h4>
                    <p>Cette Déclaration des droits et responsabilités (« Déclaration », « Conditions » ou « SRR ») émane de moroccanorganica.com et constitue nos conditions d&apos;utilisation qui régissent notre relation avec les utilisateurs et toute personne interagissant avec moroccanorganica.com, ainsi qu&apos;avec nos marques et services. En utilisant moroccanorganica.com, vous acceptez cette déclaration, telle que mise à jour. Des ressources figurent en fin de document pour vous aider à comprendre le fonctionnement du site.</p>
                    <h4>CONFIDENTIALITÉ</h4>
                    <p>Veuillez consulter notre Politique de confidentialité, qui régit également votre visite sur le site.</p>
                    <h4>COMMUNICATIONS ÉLECTRONIQUES</h4>
                    <p>En visitant moroccanorganica.com ou en nous envoyant des e-mails, vous acceptez de recevoir nos communications par voie électronique. Nous communiquerons par e-mail ou par avis sur le site. Vous acceptez que tous les accords, avis et communications électroniques satisfassent aux exigences légales.</p>
                    <h4>DROITS D&Apos;AUTEUR</h4>
                    <p>Tout contenu du site (textes, graphiques, logos, images, logiciels, etc.) est la propriété de moroccanorganica.com ou de ses fournisseurs et protégé par les lois internationales sur le droit d&apos;auteur.</p>
                    <h4>MARQUES</h4>
                    <p>Les marques et l&apos;apparence de moroccanorganica.com ne peuvent être utilisées en lien avec un produit ou service non affilié à Organica, de manière à créer une confusion ou à nuire à la réputation de moroccanorganica.com.</p>
                    <h4>LICENCE ET ACCÈS AU SITE</h4>
                    <p>moroccanorganica.com vous accorde une licence limitée pour accéder au site et l&apos;utiliser à titre personnel, sans téléchargement (hors cache) ni modification sans accord écrit. Cette licence n&apos;inclut pas la revente, l&apos;usage commercial, l&apos;extraction de données ou l&apos;utilisation de robots. Toute utilisation non autorisée met fin à la licence.</p>
                    <h4>VOTRE COMPTE</h4>
                    <p>Vous êtes responsable de la confidentialité de votre compte et mot de passe. Les mineurs de 18 ans ne peuvent utiliser le site qu&apos;avec un parent ou tuteur. Organica se réserve le droit de refuser le service, de clôturer des comptes ou d&apos;annuler des commandes.</p>
                </>
            ),
            section1: (
                <>
                    <h4>AVIS, COMMENTAIRES ET CONTENUS</h4>
                    <p>Les visiteurs peuvent publier des avis et commentaires tant que le contenu n&apos;est pas illégal, diffamatoire ou préjudiciable. moroccanorganica.com se réserve le droit de supprimer ou modifier tout contenu. En publiant du contenu, vous accordez à Organica une licence non exclusive, perpétuelle et mondiale pour l&apos;utiliser et le modifier. Vous garantissez détenir les droits sur le contenu publié et indemnisez Organica pour toute réclamation liée à ce contenu.</p>
                    <h4>DESCRIPTIONS DES SERVICES</h4>
                    <p>Organica s&apos;efforce d&apos;être aussi précis que possible. Toutefois, moroccanorganica.com ne garantit pas que les descriptions de produits ou services sont complètes, fiables ou exemptes d&apos;erreurs. LE SITE EST FOURNI « EN L&apos;ÉTAT ». MOROCCANORGANICA.COM N&apos;OFFRE AUCUNE GARANTIE, EXPRESSE OU IMPLICITE. VOTRE UTILISATION DU SITE EST À VOS PROPRES RISQUES. DANS LA MESURE PERMISE PAR LA LOI, ORGANICA NE SERA PAS RESPONSABLE DES DOMMAGES DIRECTS, INDIRECTS OU CONSÉCUTIFS.</p>
                    <h4>LOI APPLICABLE</h4>
                    <p>En visitant moroccanorganica.com, vous acceptez que le droit marocain, sans égard aux conflits de lois, régisse ces conditions et tout litige vous opposant à Organica.</p>
                    <h4>LITIGES</h4>
                    <p>Tout litige relatif à votre visite ou aux produits et services achetés via moroccanorganica.com sera soumis à un arbitrage confidentiel au Maroc, sauf en cas de violation des droits de propriété intellectuelle d&apos;Organica, qui pourra saisir les tribunaux marocains.</p>
                    <h4>POLITIQUES DU SITE, MODIFICATIONS</h4>
                    <p>Veuillez consulter les autres politiques publiées sur le site. Nous nous réservons le droit de modifier le site, les politiques et ces conditions à tout moment. Si une disposition est jugée invalide, elle sera réputée détachable sans affecter le reste.</p>
                    <h4>QUESTIONS</h4>
                    <p>Pour toute question relative aux conditions d&apos;utilisation, à la politique de confidentialité ou à toute autre politique, contactez notre support via le lien « Contact » ou par e-mail : info@moroccanorganica.com</p>
                </>
            )
        }
    };

    const t = content[lang as keyof typeof content] || content.en;
    const homeLabel = isAr ? "الصفحة الرئيسية" : lang === "fr" ? "Accueil" : "Home";

    return (
        <div className="min-h-screen bg-background">
            <InnerHero
                title={t.heroTitle}
                description={t.heroDesc}
                backgroundImage="/images/slider/hero-authentic-argan-oil.webp"
                breadcrumbs={[
                    { label: homeLabel, href: `/${lang}` },
                    { label: isAr ? "أورغانيكا" : "Organica", href: `/${lang}/organica` },
                    { label: t.breadcrumbCurrent },
                ]}
            />

            <section className="py-16 md:py-24" dir={isAr ? "rtl" : "ltr"}>
                <div className="container-main max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12">
                        <motion.div className="rich-text-content" {...fadeInUp}>
                            {t.section2}
                        </motion.div>

                        <motion.div className="rich-text-content" {...fadeInUp} transition={{ delay: 0.1 }}>
                            {t.section1}
                        </motion.div>
                    </div>
                </div>
            </section>

            <CertificationSlider />
        </div>
    );
}
