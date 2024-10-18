const {Keyboard} = require("grammy")
const {courseList, menuList, marathonList, learnList} = require("./data")
const i18n = require("./i18n")


const menuListButtons = menuList.map((v)=>[Keyboard.text(i18n.t('uz',v.name))])
const mainKeyboard =Keyboard.from(menuListButtons).resized()



const courseListButtons = courseList.map((v)=>[Keyboard.text(i18n.t('uz',v.name))])
const courseKeyboard = Keyboard.from(courseListButtons).resized()


const marathonListButtons = marathonList.map((v)=>[Keyboard.text(i18n.t('uz',v.name))])
const marathonKeyboard = Keyboard.from(marathonListButtons).resized()

const learnListButtons = learnList.map((v)=>[Keyboard.text(i18n.t('uz',v.name))])
const learnKeyboard = Keyboard.from(learnListButtons).resized()



module.exports = {mainKeyboard, courseKeyboard, marathonKeyboard, learnKeyboard}