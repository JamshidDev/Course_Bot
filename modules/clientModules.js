const { Composer, Keyboard} = require("grammy");
const { Menu, MenuRange } = require("@grammyjs/menu");
const { I18n, hears } = require("@grammyjs/i18n");
const {mainKeyboard, courseKeyboard,marathonKeyboard,learnKeyboard, } = require("../utils/keyboards")
const {
    conversations,
    createConversation,
} = require("@grammyjs/conversations");
const { check_user, register_user, remove_user, set_user_lang } = require("../controllers/userController");

const composer = new Composer();
const i18n = new I18n({
    defaultLocale: "uz",
    useSession: true,
    directory: "locales",
    globalTranslationContext(ctx) {
        return { first_name: ctx.from?.first_name ?? "" };
    },
});
composer.use(i18n);

const bot = composer.chatType("private")
const adminList = [1038293334, 1847395657]






bot.use(createConversation(mainConversation))
bot.use(createConversation(courseConversation))
bot.use(createConversation(mainMenuConversation))
bot.use(createConversation(orderCourseConversation))




async function mainConversation(conversation, ctx){
    await ctx.reply(ctx.t("start_hello_msg", {
        full_name: ctx.from.first_name,
        organization_name: "AL FALAAH"
    }), {
        parse_mode: "HTML",
        reply_markup: mainKeyboard
    })
}

async function courseConversation(conversation, ctx){
    await ctx.reply(ctx.t("start_hello_msg", {
        full_name: ctx.from.first_name,
        organization_name: "AL FALAAH"
    }), {
        parse_mode: "HTML",
        reply_markup: courseKeyboard
    })
}

async function mainMenuConversation(conversation, ctx){
    await ctx.reply("⚡️ Asosiy menu ⚡️", {
        parse_mode: "HTML",
        reply_markup: mainKeyboard
    })
}

async function orderCourseConversation(conversation, ctx){
    let data = {
        course:ctx.session.session_db.selectedCourse,
        fullName:null,
        phone:null,
    }

    await ctx.reply(ctx.t("order_course_fullName"),{
        parse_mode: "HTML",
        reply_markup: new Keyboard().text(ctx.t('back_main')).resized()
    })

    ctx = await conversation.wait();
    if (!ctx.message?.text) {
        do {
            await ctx.reply(ctx.t("fullName_error_msg"), {
                parse_mode: "HTML",
            });
            ctx = await conversation.wait();
        } while (!ctx.message?.text);
    }
    data.fullName = ctx.message?.text

    await ctx.reply(ctx.t("phone_number"),{
        parse_mode: "HTML",
        reply_markup: new Keyboard()
            .requestContact(ctx.t('phone_button'))
            .row()
            .text(ctx.t('back_main')).resized()
    })

    ctx = await conversation.wait();

    if (!ctx.message?.contact) {
        do {
            await ctx.reply(ctx.t("phone_number_error_msg"), {
                parse_mode: "HTML",
            });
            ctx = await conversation.wait();
        } while (!ctx.message?.contact);
    }
    data.phone = ctx.message?.contact.phone_number

    await ctx.reply(ctx.t("success_order"),{
        parse_mode: "HTML",
    })

    for(let i=0; i<adminList.length; i++){
        let adminId = adminList[i]
        await ctx.api.sendMessage(adminId,ctx.t('order_alert_mg',{
            order:data.course,
            fullName:data.fullName,
            phone:data.phone,
            userId:ctx.from.id
        }),{
            parse_mode: "HTML",
        })
    }
    await mainMenuConversation(conversation, ctx)
}








const orderCourseButton = new Menu("order_course")
    .dynamic(async (ctx, range) => {
        let list = [{
            name: "order_course_button",
            key: "uz"
        },
        ]
        list.forEach((item) => {
            range
                .text(ctx.t(item.name), async (ctx) => {
                    await ctx.answerCallbackQuery();
                    await ctx.deleteMessage();
                    await ctx.conversation.enter("orderCourseConversation");

                })
                .row();
        })
    })
bot.use(orderCourseButton)



bot.command("start", async (ctx) => {
    let lang = await ctx.i18n.getLocale();
    if (!i18n.locales.includes(lang)) {
        await ctx.i18n.setLocale("uz");
    }
    let user = await check_user(ctx.from.id);
    data = {
        user_id: ctx.from.id,
        full_name: ctx.from.first_name,
        username: ctx.from.username || null,
        active: true
    }
    if (user) {
        await ctx.i18n.setLocale(user.lang);
        data.lang = user.lang;
        await register_user(data);
    } else {
        lang = await ctx.i18n.getLocale()
        data.lang = lang;
        await register_user(data);
    }
    console.log(ctx.from.id)
    await ctx.conversation.enter("mainConversation");

})










bot.filter(hears("back_main"), async (ctx) => {
    await ctx.conversation.enter("mainMenuConversation");
});


bot.filter(hears("menu_one"), async (ctx) => {
    await ctx.reply(`
✨ KURSLAR

👇 Kerakli kursni tanlang!    
    `,{
        parse_mode: "HTML",
        reply_markup: courseKeyboard
    })
});

bot.filter(hears("course_one"), async (ctx) => {
    ctx.session.session_db.selectedCourse = ctx.t('course_one')
    await ctx.reply(ctx.t('course_one_description'),{
        parse_mode: "HTML",
        reply_markup: orderCourseButton,
    })
});

bot.filter(hears("course_two"), async (ctx) => {
    ctx.session.session_db.selectedCourse = ctx.t('course_two')
    await ctx.reply(ctx.t('course_two_description'),{
        parse_mode: "HTML",
        reply_markup: orderCourseButton,
    })
});

bot.filter(hears("course_three"), async (ctx) => {
    ctx.session.session_db.selectedCourse = ctx.t('course_three')
    await ctx.reply(ctx.t('course_three_description'),{
        parse_mode: "HTML",
        reply_markup: orderCourseButton,
    })
});

bot.filter(hears("course_four"), async (ctx) => {
    ctx.session.session_db.selectedCourse = ctx.t('course_four')
    await ctx.reply(ctx.t('course_four_description'),{
        parse_mode: "HTML",
        reply_markup: orderCourseButton,
    })
});

bot.filter(hears("course_five"), async (ctx) => {
    ctx.session.session_db.selectedCourse = ctx.t('course_five')
    await ctx.reply(ctx.t('course_five_description'),{
        parse_mode: "HTML",
        reply_markup: orderCourseButton,
    })
});



bot.filter(hears("menu_two"), async (ctx) => {
    await ctx.reply(`
✨ "TAVBA" MARAFONI

👇 Kerakli tarifni tanlang!    
    `,{
        parse_mode: "HTML",
        reply_markup: marathonKeyboard
    })
});

bot.filter(hears("marathon_one"), async (ctx) => {
    ctx.session.session_db.selectedCourse = ctx.t('marathon_one')
    await ctx.reply(ctx.t('marathon_one_description'),{
        parse_mode: "HTML",
        reply_markup: orderCourseButton,
    })
});

bot.filter(hears("marathon_two"), async (ctx) => {
    ctx.session.session_db.selectedCourse = ctx.t('marathon_two')
    await ctx.reply(ctx.t('marathon_two_description'),{
        parse_mode: "HTML",
        reply_markup: orderCourseButton,
    })
});

bot.filter(hears("marathon_three"), async (ctx) => {
    ctx.session.session_db.selectedCourse = ctx.t('marathon_three')
    await ctx.reply(ctx.t('marathon_three_description'),{
        parse_mode: "HTML",
        reply_markup: orderCourseButton,
    })
});


bot.filter(hears("menu_three"), async (ctx) => {
    await ctx.reply(`
✨ SHOGIRDLIK

👇 Kerakli o'qish turini tanlang!    
    `,{
        parse_mode: "HTML",
        reply_markup: learnKeyboard
    })
});

bot.filter(hears("online_learn"), async (ctx) => {
    ctx.session.session_db.selectedCourse = ctx.t('online_learn')
    await ctx.reply(ctx.t('online_learn_description'),{
        parse_mode: "HTML",
        reply_markup: orderCourseButton,
    })
});

bot.filter(hears("offline_learn"), async (ctx) => {
    ctx.session.session_db.selectedCourse = ctx.t('offline_learn')
    await ctx.reply(ctx.t('offline_learn_description'),{
        parse_mode: "HTML",
        reply_markup: orderCourseButton,
    })
});


bot.filter(hears("menu_four"), async (ctx) => {
    ctx.session.session_db.selectedCourse = ctx.t('menu_four')
    await ctx.reply(ctx.t('consultation_description'),{
        parse_mode: "HTML",
        reply_markup: orderCourseButton,
    })
});
















































module.exports =  bot