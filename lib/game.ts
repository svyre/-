export const MONTHS = ['Сентябрь','Октябрь','Ноябрь','Декабрь','Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август'];
export const SHORT_MONTHS = ['Сен','Окт','Ноя','Дек','Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг'];
export type GoalId = 'capital' | 'career' | 'freedom';
export type DifficultyId = 'first' | 'balance' | 'challenge';
export const DIFFICULTIES: Record<DifficultyId,{name:string;label:string;description:string;cash:number;savings:number;support:number;hours:number;marketFactor:number;inflationFactor:number}> = {
  first:{name:'Первый шаг',label:'Легче',description:'Больше запаса для экспериментов и спокойного знакомства с бюджетом.',cash:36000,savings:18000,support:21000,hours:144,marketFactor:.75,inflationFactor:.75},
  balance:{name:'Баланс',label:'Средне',description:'Самостоятельный год, в котором нужно совместить деньги, учёбу и отдых.',cash:26000,savings:12000,support:18000,hours:128,marketFactor:1,inflationFactor:1},
  challenge:{name:'Вызов',label:'Сложнее',description:'Меньше поддержки и времени. Резерв и точный расчёт решают больше.',cash:18000,savings:6000,support:14000,hours:112,marketFactor:1.5,inflationFactor:1.5},
};
export const difficultyId = (value:unknown):DifficultyId => typeof value==='string'&&Object.hasOwn(DIFFICULTIES,value)?value as DifficultyId:'balance';
export const GOALS: Record<GoalId,{name:string;description:string;target:number;skills:number}> = {
  capital:{name:'Первый капитал',description:'100 000 ₽ капитала и устойчивый бюджет к концу года.',target:100000,skills:0},
  career:{name:'Сильный старт',description:'70 000 ₽ капитала и 4 профессиональных навыка.',target:70000,skills:4},
  freedom:{name:'Большая цель',description:'140 000 ₽ капитала. Амбициозно, но с заботой о себе.',target:140000,skills:0},
};
export const HOUSING = [
  {id:'dorm',name:'Общежитие',cost:6500,transport:1500,hours:18,description:'Дешевле жить, дольше добираться'},
  {id:'shared',name:'Квартира с друзьями',cost:11500,transport:1000,hours:10,description:'Делишь расходы и пространство'},
  {id:'alone',name:'Своя студия',cost:19000,transport:700,hours:4,description:'Больше комфорта и времени'},
];
export const JOBS = [
  {id:'none',name:'Сосредоточиться на учёбе',income:0,hours:0,fatigue:0,education:1},
  {id:'flex',name:'Гибкая подработка',income:8500,hours:28,fatigue:12,education:0},
  {id:'part',name:'Неполный рабочий день',income:14500,hours:52,fatigue:20,education:-2},
  {id:'intense',name:'Плотный рабочий график',income:23000,hours:84,fatigue:31,education:-7},
];
export const STUDIES = [{hours:16,name:'Минимум',gain:-2},{hours:32,name:'В балансе',gain:2},{hours:48,name:'Вглубь',gain:5}];
export const OFFERS = [
  {id:'clear',name:'Понятный',rate:24,term:6,fee:0,monthlyFee:0,tag:'6 месяцев'},
  {id:'comfort',name:'Комфорт',rate:18,term:12,fee:1900,monthlyFee:390,tag:'Низкая ставка'},
  {id:'zero',name:'Без процентов',rate:0,term:4,fee:1800,monthlyFee:0,tag:'0% годовых'},
];
export type Option = {id:string;title:string;description:string;cost?:number;income?:number;hours?:number;education?:number;energy?:number;skills?:number;safety?:number;hiddenLoss?:number;loan?:number;explanation:string;delayed?:{after:number;cash?:number;skills?:number;title:string}};
export type Scenario = {title:string;topic:string;lead:string;document:{title:string;text:string};options:Option[];discussion:string};
export const SCENARIOS:Scenario[] = [
  {title:'Техника для нового старта',topic:'Стоимость выбора',lead:'Первый месяц в университете. Старый ноутбук ещё работает, но тормозит на учебных проектах. В магазине — «последний день скидок». Как поступишь?',document:{title:'Сравнить предложения',text:'Новый ноутбук — 32 000 ₽, гарантия 12 месяцев. Восстановленный — 18 000 ₽, гарантия 3 месяца, диагностика включена. Старый можно обслужить за 4 000 ₽. Учебный компьютерный класс доступен бесплатно. Все цены — условия игры.'},options:[
    {id:'new',title:'Купить новый',description:'32 000 ₽ · учёба +6',cost:32000,education:6,energy:3,explanation:'Новый ноутбук помог учиться, но крупная покупка уменьшила запас денег. Его ценность зависит от того, остался ли резерв.'},
    {id:'restore',title:'Восстановленный',description:'18 000 ₽ · учёба +4',cost:18000,education:4,explanation:'Ты сопоставил цену и возможности. Более короткая гарантия — реальное условие, которое нужно учитывать при покупке.'},
    {id:'service',title:'Обслужить старый',description:'4 000 ₽ · 4 часа · учёба +1',cost:4000,hours:4,education:1,safety:1,explanation:'Ты продлил срок службы техники и сохранил больше денег на другие цели. Учебный эффект скромнее, чем у новой модели.'},
  ],discussion:'Как понять, стоит ли более дорогая вещь своих денег? Какие расходы возникнут после покупки?'},
  {title:'Слишком удобная подработка',topic:'Проверка предложений',lead:'В студенческий чат прислали вакансию: хороший доход, свободный график и никаких требований. Параллельно университет предлагает работу на мероприятии.',document:{title:'Открыть сообщения работодателей',text:'Чат: «Доход от 40 000 ₽! Для активации кабинета переведите 3 000 ₽ на личную карту куратора. Договор после оплаты». Университет: 6 000 ₽ за 16 часов работы, письменные условия и оплата после мероприятия. Можно сначала потратить 6 часов на проверку и взять небольшую задачу за 2 000 ₽.'},options:[
    {id:'access',title:'Оплатить доступ',description:'3 000 ₽ · обещают высокий доход',cost:3000,safety:-3,explanation:'После оплаты контакт исчез. Предоплата на личную карту и отказ показать договор были признаками риска. В игре потеря составила 3 000 ₽.'},
    {id:'university',title:'Работа в университете',description:'+6 000 ₽ · 16 часов',income:6000,hours:16,safety:1,explanation:'Проверяемый заказчик и понятные условия дали предсказуемый доход. Но работа заняла время — его тоже нужно включать в бюджет.'},
    {id:'check',title:'Проверить и начать с малого',description:'+2 000 ₽ · 6 часов',income:2000,hours:6,safety:2,explanation:'Проверка потребовала времени, зато позволила не платить за обещание работы и найти небольшую безопасную задачу.'},
  ],discussion:'Каких сведений не хватает для решения? Почему обещанный доход нельзя считать уже заработанным?'},
  {title:'Телефон не пережил ноябрь',topic:'Резерв и рассрочка',lead:'Телефон разбился, а без него сложно учиться и работать. Сервис предлагает ремонт, магазин — новый аппарат или оплату частями.',document:{title:'Прочитать условия оплаты',text:'Ремонт — 5 500 ₽ сразу. Новый аппарат — 24 000 ₽. Оплата ремонта частями: 5 500 ₽ на 5 следующих месяцев без процентов, разовая комиссия 900 ₽ сегодня. В игру включена полная стоимость ремонта и комиссии; реальный договор может содержать другие условия.'},options:[
    {id:'repair',title:'Заплатить за ремонт',description:'5 500 ₽ сейчас',cost:5500,explanation:'Резерв помог закрыть неожиданную трату без будущих платежей. Восстановление резерва станет следующей задачей.'},
    {id:'parts',title:'Разделить оплату',description:'900 ₽ сейчас + 5 × 1 100 ₽',cost:900,loan:5500,explanation:'Платёж сейчас оказался меньше, но полная стоимость ремонта — 6 400 ₽. Пять следующих месяцев по 1 100 ₽ уже заняты обязательством.'},
    {id:'replace',title:'Купить новый аппарат',description:'24 000 ₽ · ресурс +4',cost:24000,energy:4,explanation:'Более дорогой выбор дал удобство, но сильно сократил доступные деньги. Покупку стоит сопоставить с целью и размером резерва.'},
  ],discussion:'Чем отличается цена вещи от полной суммы платежей? Когда рассрочка помогает, а когда маскирует нехватку денег?'},
  {title:'Декабрь без финансового похмелья',topic:'Приоритеты',lead:'Подарки, встречи и распродажи. Хочется порадовать близких и себя, но финансовая цель сама себя не оплатит.',document:{title:'Открыть список расходов',text:'Большой набор подарков — 11 000 ₽. Заранее выбранные подарки — 3 000 ₽. Сделанные своими руками — 1 500 ₽ и 8 часов. Эмоциональная ценность не обязана совпадать с ценой.'},options:[
    {id:'big',title:'Подарить с размахом',description:'11 000 ₽ · ресурс +9',cost:11000,energy:9,explanation:'Ты выбрал впечатления и щедрость. Это осмысленная трата, если она помещается в бюджет и не создаёт непосильных обязательств.'},
    {id:'list',title:'Уложиться в список',description:'3 000 ₽ · ресурс +5',cost:3000,energy:5,safety:1,explanation:'Список помог заранее установить предел расходов. Такой приём уменьшает влияние скидок и импульсивных решений.'},
    {id:'handmade',title:'Сделать самому',description:'1 500 ₽ · 8 часов · ресурс +6',cost:1500,hours:8,energy:6,explanation:'Ты заменил часть денежных затрат временем. Экономия есть, но свободные часы тоже ограничены.'},
  ],discussion:'Как заложить праздники в годовой план? Всегда ли самый дешёвый вариант лучший?'},
  {title:'Время тоже имеет цену',topic:'Человеческий капитал',lead:'Началась сессия. Есть возможность взять дополнительные смены, подготовиться с группой или вложиться в короткий курс по специальности.',document:{title:'Изучить варианты',text:'Смены: 9 000 ₽ за 20 часов, учёба −5. Группа подготовки: 16 часов, учёба +8. Практический курс: 5 000 ₽ и 20 часов; навык появится через два месяца. Каждый профессиональный навык увеличивает месячную оплату подработки на 700 ₽.'},options:[
    {id:'shifts',title:'Взять смены',description:'+9 000 ₽ · 20 часов · учёба −5',income:9000,hours:20,education:-5,explanation:'Смены принесли деньги сейчас, но уменьшили результат учёбы. При учёбе ниже 50 баллов стипендия следующего месяца исчезнет.'},
    {id:'group',title:'Подготовиться вместе',description:'16 часов · учёба +8',hours:16,education:8,explanation:'Ты инвестировал время в знания. Высокий уровень учёбы сохраняет стипендию и помогает выполнить итоговую цель.'},
    {id:'course',title:'Пройти практический курс',description:'5 000 ₽ · 20 часов · навык позже',cost:5000,hours:20,delayed:{after:2,skills:1,title:'Завершён практический курс'},explanation:'У обучения отложенный результат: через два месяца появится навык. Доход вырастет только в месяцы, когда ты работаешь.'},
  ],discussion:'Как посчитать срок окупаемости обучения? Какие выгоды курса нельзя выразить только деньгами?'},
  {title:'«Это служба безопасности»',topic:'Финансовая безопасность',lead:'Пришло сообщение о подозрительной операции. Отправитель торопит: «Осталось 10 минут, иначе деньги уйдут».',document:{title:'Посмотреть сообщение',text:'«ВАША КАРТА ПОД УГРОЗОЙ. Откройте bank-protect-help.example и сообщите код из СМС специалисту. Сохраните разговор в тайне». В приложении учебного банка уведомления об операции нет. Адрес вымышленный и никуда не ведёт.'},options:[
    {id:'code',title:'Передать код «специалисту»',description:'Быстро выполнить инструкцию',hiddenLoss:9000,safety:-4,explanation:'Код подтвердил чужую операцию: в модели потеряно 9 000 ₽. Срочность, секретность и запрос кода были признаками социальной инженерии.'},
    {id:'official',title:'Проверить через приложение',description:'2 часа · независимая проверка',hours:2,safety:3,explanation:'Ты открыл приложение самостоятельно, не используя ссылку из сообщения. Проверка не подтвердила угрозу: деньги сохранены.'},
    {id:'ignore',title:'Закрыть сообщение',description:'Не отвечать и не переходить',safety:1,explanation:'Ты не передал данные и сохранил деньги. Независимая проверка помогла бы также убедиться, что реальной операции не было.'},
  ],discussion:'Почему знание имени клиента не доказывает, что звонит банк? Как проверить сообщение независимым способом?'},
  {title:'Квартира требует внимания',topic:'Финансовая подушка',lead:'Сломалась общая техника. Взнос на восстановление — 10 000 ₽. Можно организовать совместную закупку или договориться о двух платежах.',document:{title:'Узнать полную стоимость',text:'Обычный взнос — 10 000 ₽. Совместная закупка: 6 000 ₽ и 12 часов на организацию. Два платежа: 5 500 ₽ сегодня и 5 500 ₽ в следующем месяце. Это учебные условия; правила ремонта и обязанности сторон здесь не моделируются.'},options:[
    {id:'reserve',title:'Оплатить из бюджета',description:'10 000 ₽ сейчас',cost:10000,explanation:'Одноразовый платёж закрыл вопрос. Резерв нужен именно для таких расходов, а после использования его важно пополнить.'},
    {id:'organize',title:'Организовать закупку',description:'6 000 ₽ · 12 часов',cost:6000,hours:12,skills:1,explanation:'Организация сократила денежный расход и развила навык. Цена экономии — двенадцать часов твоего времени.'},
    {id:'split',title:'Договориться о платежах',description:'5 500 ₽ сейчас и через месяц',cost:5500,delayed:{after:1,cash:-5500,title:'Второй платёж за ремонт'},explanation:'Перенос платежа сохранил деньги сегодня, но общая стоимость выросла до 11 000 ₽. Следующий платёж уже включён в будущий бюджет.'},
  ],discussion:'Чем резерв отличается от накоплений на покупку? Какой размер резерва подходит именно твоей стратегии?'},
  {title:'Опыт или деньги сегодня?',topic:'Доход и развитие',lead:'Открылась практика по специальности. Можно выбрать оплачиваемую задачу, интенсивное обучение или сохранить обычный график.',document:{title:'Сопоставить условия практики',text:'Задача: 8 000 ₽, 20 часов, один навык. Интенсив: бесплатно, 30 часов, два навыка и учёба +3. Обычный график: без дополнительных часов и дохода, ресурс +4. Навыки влияют на следующие месяцы, а не меняют прошлую зарплату.'},options:[
    {id:'paid',title:'Оплачиваемая практика',description:'+8 000 ₽ · 20 часов · навык +1',income:8000,hours:20,skills:1,explanation:'Практика совместила доход и развитие. Дополнительный навык увеличит оплату подработки со следующего месяца.'},
    {id:'intensive',title:'Профессиональный интенсив',description:'30 часов · навыки +2 · учёба +3',hours:30,skills:2,education:3,explanation:'Ты выбрал больший отложенный эффект. Он окупается лишь при использовании навыков, поэтому важен оставшийся горизонт игры.'},
    {id:'usual',title:'Сохранить свой ритм',description:'Ресурс +4',energy:4,explanation:'Ты сохранил время и силы. Отказ от возможности может быть разумным, если дополнительная нагрузка разрушает текущий план.'},
  ],discussion:'Когда бесплатная практика слишком дорога по времени? Почему одна и та же возможность подходит не каждому?'},
  {title:'Доходность, которой хочется верить',topic:'Риск и обещания',lead:'Знакомый зовёт в закрытый инвестиционный клуб: «20% каждый месяц, без риска». До конца набора осталось два часа.',document:{title:'Проверить рекламное предложение',text:'Клуб обещает фиксированные 20% в месяц, предлагает перевод на личную карту и бонус за приглашённых друзей. Документов об активах нет. Для сравнения: у учебного индексного фонда нет гарантированной доходности, стоимость меняется каждый месяц; история прошлых изменений доступна в разделе «Банк».'},options:[
    {id:'club',title:'Внести 10 000 ₽',description:'Поверить обещанию клуба',cost:10000,safety:-3,explanation:'Клуб перестал отвечать после взноса. Гарантия высокой доходности, личная карта и вознаграждение за новых участников требовали проверки.'},
    {id:'research',title:'Разобраться в рисках',description:'6 часов · навык +1',hours:6,skills:1,safety:2,explanation:'Ты проверил, откуда должна возникать доходность, и не нашёл подтверждений обещаний. Анализ развил навык оценки предложений.'},
    {id:'pass',title:'Следовать своему плану',description:'Сохранить деньги и время',safety:1,explanation:'Ты не включил непроверенное предложение в свой план. Упущенное обещание не равно упущенному гарантированному доходу.'},
  ],discussion:'Что произойдёт с 10 000 ₽ при 20% в месяц за год? Почему необычно высокая обещанная доходность требует проверки?'},
  {title:'Финишная прямая семестра',topic:'Планирование нагрузки',lead:'Экзамены совпали с сезоном заказов. Работодатель предлагает премию за дополнительные смены, но подготовку никто не отменял.',document:{title:'Посчитать нагрузку',text:'Премия: 12 000 ₽ за 24 дополнительных часа, учёба −6 и ресурс −4. Подготовка: 24 часа, учёба +9. Компромисс: 5 000 ₽ за 12 часов, учёба +2. Свободное время после обязательных занятий и сна зависит от выбранной сложности; лимит показан в плане месяца.'},options:[
    {id:'bonus',title:'Выбрать премию',description:'+12 000 ₽ · 24 часа · учёба −6',income:12000,hours:24,education:-6,energy:-4,explanation:'Премия увеличила доход, но итоговая устойчивость зависит также от учёбы и ресурса. Высокая выручка сама по себе ещё не победа.'},
    {id:'exam',title:'Подготовиться к экзаменам',description:'24 часа · учёба +9',hours:24,education:9,explanation:'Ты укрепил знания и шансы сохранить стипендию. Краткосрочный доход уступил долгосрочной цели.'},
    {id:'balance',title:'Договориться о части задач',description:'+5 000 ₽ · 12 часов · учёба +2',income:5000,hours:12,education:2,explanation:'Ты нашёл промежуточный вариант. Его преимущество зависит от того, хватало ли тебе денег, времени и сил до предложения.'},
  ],discussion:'Как сравнивать немедленную премию с будущей стипендией? Какой запас времени нужен для неожиданных событий?'},
  {title:'Лето: заработать или восстановиться?',topic:'Устойчивость стратегии',lead:'Учебный год почти позади. На лето предлагают короткий проект, полезную стажировку или возможность спокойно восстановиться.',document:{title:'Посмотреть летние планы',text:'Проект: 14 000 ₽, 28 часов, ресурс −6. Стажировка: 6 000 ₽, 20 часов, навык +1. Поездка к близким: 4 000 ₽, ресурс +14. Обычные расходы и выбранная подработка сохраняются — проверь, как варианты сочетаются.'},options:[
    {id:'project',title:'Взять короткий проект',description:'+14 000 ₽ · 28 часов · ресурс −6',income:14000,hours:28,energy:-6,explanation:'Ты использовал лето для роста капитала. Дополнительный доход полезен, если после него остаётся ресурс на следующий этап.'},
    {id:'intern',title:'Выбрать стажировку',description:'+6 000 ₽ · 20 часов · навык +1',income:6000,hours:20,skills:1,explanation:'Стажировка дала доход и навык. В этой короткой модели он повлияет только на последний месяц, но в жизни горизонт может быть длиннее.'},
    {id:'rest',title:'Съездить к близким',description:'4 000 ₽ · ресурс +14',cost:4000,energy:14,explanation:'Ты потратил часть денег на восстановление. Поддержание ресурса помогает принимать решения и устойчиво работать.'},
  ],discussion:'Можно ли считать отдых инвестицией? Какие ограничения есть у модели длиной всего в один год?'},
  {title:'Август: твой следующий шаг',topic:'Итоги и горизонт',lead:'Первый самостоятельный год подходит к концу. Осталось последнее решение — сохранить запас, вложиться в развитие или отпраздновать результат.',document:{title:'Сравнить планы на следующий год',text:'Сохранить запас: дополнительных расходов нет. Следующий курс: 8 000 ₽ и 12 часов, навык +1. Небольшое путешествие: 15 000 ₽, ресурс +15. Навык последнего месяца не даёт зарплату задним числом, но учитывается в цели «Сильный старт».'},options:[
    {id:'keep',title:'Сохранить запас',description:'Без дополнительных расходов',safety:1,explanation:'Ты оставил больше возможностей на следующий год. Денежный запас полезен, когда у него есть понятное назначение.'},
    {id:'next',title:'Продолжить обучение',description:'8 000 ₽ · 12 часов · навык +1',cost:8000,hours:12,skills:1,explanation:'Ты продлил горизонт за пределы игры. Денежный результат стал ниже, зато профессиональный потенциал вырос.'},
    {id:'travel',title:'Отпраздновать путешествием',description:'15 000 ₽ · ресурс +15',cost:15000,energy:15,explanation:'Ты превратил часть накоплений во впечатления. Итог зависит от того, сохранились ли цель и финансовая устойчивость.'},
  ],discussion:'Какие решения ты бы повторил? Что поменялось бы, если играть ещё один год?'},
];
export const MACRO = [
  {inflation:1,savingsRate:8,market:-2,title:'Новый город, новые возможности',text:'Осваивайся и оставь место для неожиданностей.'},
  {inflation:1,savingsRate:8,market:3,title:'Сезон подработок',text:'Смотри на договор, а не только на обещанный доход.'},
  {inflation:1.02,savingsRate:9,market:-8,title:'Расходы выросли на 2%',text:'Рынок нестабилен. Прошлый рост не гарантирует будущий.'},
  {inflation:1.02,savingsRate:9,market:4,title:'Праздничный сезон',text:'Заранее выбери сумму, которую готов потратить.'},
  {inflation:1.03,savingsRate:10,market:1,title:'Первая сессия',text:'Стипендия зависит от учёбы в начале месяца.'},
  {inflation:1.03,savingsRate:10,market:-3,title:'Месяц цифровой безопасности',text:'Независимая проверка важнее срочности сообщения.'},
  {inflation:1.05,savingsRate:9,market:6,title:'Весенний пересмотр бюджета',text:'Базовые цены на 5% выше, чем в сентябре.'},
  {inflation:1.05,savingsRate:9,market:-4,title:'Начало практики',text:'Навыки сегодня — возможности завтра.'},
  {inflation:1.05,savingsRate:8,market:2,title:'Предложения повсюду',text:'Проверяй источник доходности и риски.'},
  {inflation:1.06,savingsRate:8,market:5,title:'Экзамены и возможности',text:'Базовые цены на 6% выше сентябрьских.'},
  {inflation:1.06,savingsRate:7,market:-2,title:'Летний ритм',text:'Сверь финансовый план со своим ресурсом.'},
  {inflation:1.06,savingsRate:7,market:3,title:'Время подвести итоги',text:'Оцени капитал, устойчивость и качество решений.'},
];
export type Loan = {id:string;name:string;balance:number;rate:number;remaining:number;payment:number;monthlyFee:number};
export type Pending = {due:number;cash?:number;skills?:number;title:string};
export type GameState = {cash:number;savings:number;fund:number;education:number;energy:number;skills:number;safety:number;loans:Loan[];pending:Pending[];deficits:number};
export type Plan = {housing:string;job:string;study:number;leisure:number;save:number;withdraw:number;invest:number;sell:number;borrow:number;offer:string;choice:string};
export type Ledger = {label:string;amount:number;kind:'income'|'expense'|'transfer'};
export type Report = {month:number;before:GameState;after:GameState;plan:Plan;ledger:Ledger[];explanation:string;warnings:string[];hours:number;net:number;interest:number;market:number;score:number};
export type Solo = {name:string;goal:GoalId;difficulty:DifficultyId;month:number;state:GameState;reports:Report[];plans:Plan[]};
export const INITIAL:GameState = {cash:26000,savings:12000,fund:0,education:72,energy:78,skills:0,safety:5,loans:[],pending:[],deficits:0};
export const clone = <T,>(v:T):T => JSON.parse(JSON.stringify(v));
export function initialState(difficulty:DifficultyId='balance'):GameState {const d=DIFFICULTIES[difficultyId(difficulty)];return {...clone(INITIAL),cash:d.cash,savings:d.savings};}
export function macroFor(month:number,difficulty:DifficultyId='balance') {
  const base=MACRO[Math.min(11,Math.max(0,month))],d=DIFFICULTIES[difficultyId(difficulty)];
  const inflation=1+Math.round((base.inflation-1)*d.inflationFactor*10000)/10000;
  return {...base,inflation,market:Math.round(base.market*d.marketFactor*100)/100,
    title:base.title.startsWith('Расходы выросли')?`Расходы выросли на ${percent((inflation-1)*100)}`:base.title,
    text:base.text.replace(/Базовые цены на \d+%/,`Базовые цены на ${percent((inflation-1)*100)}`)};
}
export const rub = (n:number) => new Intl.NumberFormat('ru-RU',{maximumFractionDigits:0}).format(Math.round(n))+' ₽';
export const percent = (n:number) => new Intl.NumberFormat('ru-RU',{maximumFractionDigits:2}).format(n)+'%';
const round = (n:number) => Math.round(n*100)/100;
const clamp = (n:number,a=0,b=100) => Math.min(b,Math.max(a,n));
export const debt = (s:GameState) => s.loans.reduce((a,l)=>a+l.balance,0);
export const capital = (s:GameState) => round(s.cash+s.savings+s.fund-debt(s)+s.pending.reduce((a,p)=>a+Math.min(0,p.cash||0),0));
export const essential = (p:Plan,month:number,difficulty:DifficultyId='balance') => {const h=HOUSING.find(x=>x.id===p.housing)||HOUSING[0];return Math.round((h.cost+h.transport+8500+900)*macroFor(month,difficulty).inflation);};
export function annuity(amount:number,rate:number,months:number) {const r=rate/1200;return round(r===0?amount/months:amount*r/(1-(1+r)**(-months)));}
export function creditQuote(amount:number,offerId:string) {const o=OFFERS.find(x=>x.id===offerId)||OFFERS[0];const payment=annuity(amount,o.rate,o.term);return {...o,payment:round(payment+o.monthlyFee),total:round(payment*o.term+o.fee+o.monthlyFee*o.term),overpay:round(payment*o.term+o.fee+o.monthlyFee*o.term-amount)};}
export function defaultPlan(month=0):Plan {return {housing:'dorm',job:'flex',study:32,leisure:2500,save:0,withdraw:0,invest:0,sell:0,borrow:0,offer:'clear',choice:SCENARIOS[month]?.options[SCENARIOS[month].options.length-1].id||'keep'};}
export function planHours(plan:Plan,month:number) {return (HOUSING.find(x=>x.id===plan.housing)?.hours||0)+(JOBS.find(x=>x.id===plan.job)?.hours||0)+plan.study+(SCENARIOS[month]?.options.find(x=>x.id===plan.choice)?.hours||0);}
export function validatePlan(p:Plan,s:GameState,m:number,allowEmptyChoice=false,difficulty:DifficultyId='balance'):string|null {
  if(!p||!Number.isInteger(m)||m<0||m>11)return 'Этот раунд уже завершён.';
  if(!HOUSING.some(x=>x.id===p.housing)||!JOBS.some(x=>x.id===p.job)||!STUDIES.some(x=>x.hours===p.study)||!OFFERS.some(x=>x.id===p.offer))return 'Выбери все параметры плана.';
  if(!SCENARIOS[m].options.some(x=>x.id===p.choice)&&!(allowEmptyChoice&&p.choice===''))return 'Выбери решение для события месяца.';
  for(const key of ['leisure','save','withdraw','invest','sell','borrow'] as const)if(!Number.isFinite(p[key])||p[key]<0||p[key]>1000000||!Number.isInteger(p[key]))return 'Суммы должны быть целыми неотрицательными числами.';
  if(p.leisure>15000)return 'На отдых можно запланировать до 15 000 ₽.';
  if(p.withdraw>Math.floor(s.savings))return 'На накопительном счёте недостаточно денег для снятия.';
  if(p.sell>Math.floor(s.fund))return 'Нельзя продать больше текущей стоимости фонда.';
  if(p.borrow>40000||debt(s)+p.borrow>90000)return 'Лимит нового кредита — 40 000 ₽, всех кредитов — 90 000 ₽.';
  const hours=DIFFICULTIES[difficultyId(difficulty)].hours;
  if(planHours(p,m)>hours)return `Плану не хватает времени. Уменьши нагрузку: доступно ${hours} часов.`;
  return null;
}
export function evaluate(s:GameState,goal:GoalId,p?:Plan,m=11,difficulty:DifficultyId='balance') {
  const g=GOALS[goal];const monthly=essential(p||defaultPlan(),m,difficulty);
  const goalProgress=clamp(capital(s)/g.target,0,1)*(g.skills?Math.min(1,s.skills/g.skills):1);
  const liquid=Math.max(0,s.cash+s.savings-debt(s)+s.pending.reduce((a,p)=>a+Math.min(0,p.cash||0),0));
  const reserve=liquid/(monthly*2);
  const parts=[{name:'Достижение цели',value:Math.round(goalProgress*35),max:35},{name:'Запас и обязательства',value:Math.round(clamp(reserve,0,1)*25*Math.max(0,1-s.deficits*.12)),max:25},{name:'Учёба',value:Math.round(s.education/100*20),max:20},{name:'Личный ресурс',value:Math.round(s.energy/100*10),max:10},{name:'Безопасность',value:Math.round(clamp(s.safety/10,0,1)*10),max:10}];
  return {total:parts.reduce((a,x)=>a+x.value,0),parts,goalProgress:Math.round(goalProgress*100),reserveMonths:round(liquid/monthly),achieved:goalProgress>=1&&s.education>=60&&s.energy>=35&&s.cash>=0};
}
export function settle(input:GameState,plan:Plan,month:number,goal:GoalId='capital',reveal=true,difficulty:DifficultyId='balance'):Report {
  const invalid=validatePlan(plan,input,month,!reveal,difficulty);if(invalid)throw new Error(invalid);
  const before=clone(input),s=clone(input),p=clone(plan),ledger:Ledger[]=[],warnings:string[]=[];
  const post=(label:string,amount:number,kind:Ledger['kind']=amount>=0?'income':'expense')=>{s.cash=round(s.cash+amount);ledger.push({label,amount:round(amount),kind});};
  const macro=macroFor(month,difficulty),level=DIFFICULTIES[difficultyId(difficulty)],h=HOUSING.find(x=>x.id===p.housing)!,j=JOBS.find(x=>x.id===p.job)!,study=STUDIES.find(x=>x.hours===p.study)!,option:Option=SCENARIOS[month].options.find(x=>x.id===p.choice)||{id:'',title:'Событие ещё не выбрано',description:'',explanation:''};
  const interest=round(s.savings*macro.savingsRate/1200);s.savings=round(s.savings+interest);
  s.savings=round(s.savings-p.withdraw);post('С накопительного счёта',p.withdraw,'transfer');
  s.fund=round(s.fund-p.sell);post('Продажа доли фонда',p.sell,'transfer');
  const market=reveal?round(s.fund*macro.market/100):0;s.fund=round(s.fund+market);
  for(const pending of s.pending.filter(x=>x.due<=month)){if(pending.cash)post(pending.title,pending.cash);if(pending.skills)s.skills+=pending.skills;}
  s.pending=s.pending.filter(x=>x.due>month);
  for(const loan of s.loans){const fee=round(loan.balance*loan.rate/1200),principal=Math.min(loan.balance,Math.max(0,loan.payment-fee));post('Платёж: '+loan.name,-round(principal+fee+loan.monthlyFee));loan.balance=round(loan.balance-principal);loan.remaining--;if(loan.remaining<=0&&loan.balance>.05){post('Последний остаток: '+loan.name,-loan.balance);loan.balance=0;}}
  s.loans=s.loans.filter(x=>x.balance>.05);
  if(input.cash<0)post('Стоимость дефицита прошлого месяца',-round(-input.cash*.03));
  if(p.borrow>0){const q=creditQuote(p.borrow,p.offer);post('Новый кредит',p.borrow,'transfer');if(q.fee)post('Разовая комиссия кредита',-q.fee);s.loans.push({id:`loan-${month}`,name:q.name,balance:p.borrow,rate:q.rate,remaining:q.term,payment:annuity(p.borrow,q.rate,q.term),monthlyFee:q.monthlyFee});}
  post('Поддержка семьи',level.support);
  if(input.education>=50)post('Стипендия',3000);else warnings.push('Стипендии нет: учёба в начале месяца ниже 50.');
  const income=Math.round((j.income+(j.income>0?s.skills*700:0))*(input.energy<25?.7:1));if(income)post('Подработка',income);
  if(input.energy<25&&j.income>0)warnings.push('Из-за истощения доход от подработки снижен на 30%.');
  post(h.name,-Math.round(h.cost*macro.inflation));post('Продукты',-Math.round(8500*macro.inflation));post('Транспорт',-Math.round(h.transport*macro.inflation));post('Связь и бытовые расходы',-Math.round(900*macro.inflation));post('Отдых и личные траты',-p.leisure);
  if(option.cost)post('Событие: '+option.title,-option.cost);if(option.income)post('Событие: '+option.title,option.income);
  if(option.loan)s.loans.push({id:`event-${month}`,name:'Ремонт частями',balance:option.loan,rate:0,remaining:5,payment:option.loan/5,monthlyFee:0});
  if(option.delayed)s.pending.push({due:month+option.delayed.after,...option.delayed});
  if(p.save+p.invest>Math.max(0,s.cash)+.01)throw new Error('На переводы не хватает денег. Уменьши пополнение накоплений или фонда.');
  if(p.save){post('На накопительный счёт',-p.save,'transfer');s.savings=round(s.savings+p.save);}
  if(p.invest){post('Покупка доли фонда',-p.invest,'transfer');s.fund=round(s.fund+p.invest);}
  if(option.hiddenLoss&&reveal)post('Потеря из-за передачи кода',-option.hiddenLoss);
  s.education=clamp(s.education-1+study.gain+j.education+(option.education||0)-(input.energy<25?3:0));
  s.energy=clamp(Math.round(s.energy+22+p.leisure/800-j.fatigue-p.study/10-h.hours/8-(option.hours||0)/6+(option.energy||0)));
  s.skills+=option.skills||0;s.safety=clamp(s.safety+(option.safety||0),0,10);
  if(s.cash<0){s.deficits++;warnings.push('Бюджет ушёл в минус. В следующем месяце дефицит нужно закрыть; его стоимость в модели — 3% в месяц.');}
  if(s.education<50)warnings.push('Под угрозой стипендия следующего месяца.');if(s.energy<35)warnings.push('Ресурс заканчивается: пересмотри нагрузку и отдых.');
  return {month,before,after:s,plan:p,ledger:ledger.filter(x=>x.amount!==0),explanation:option.explanation,warnings,hours:planHours(p,month),net:round(capital(s)-capital(before)),interest,market,score:evaluate(s,goal,p,month,difficulty).total};
}
export function replay(reports:Report[],changedMonth:number,choice:string,goal:GoalId,difficulty:DifficultyId='balance'){let state=initialState(difficulty);const result:Report[]=[];let trimmed=0;for(let i=0;i<reports.length;i++){let p=clone(reports[i].plan);if(i===changedMonth)p.choice=choice;
  const oldWithdraw=p.withdraw,oldSell=p.sell;p.withdraw=Math.min(p.withdraw,Math.floor(state.savings));p.sell=Math.min(p.sell,Math.floor(state.fund));trimmed+=oldWithdraw-p.withdraw+oldSell-p.sell;
  const err=validatePlan(p,state,i,false,difficulty);if(err)throw new Error(MONTHS[i]+': '+err);
  try{const r=settle(state,p,i,goal,true,difficulty);state=r.after;result.push(r);}catch(e){if(!(e instanceof Error)||!e.message.startsWith('На переводы'))throw e;const requested=p.save+p.invest;p.save=0;p.invest=0;const base=settle(state,p,i,goal,true,difficulty);const budget=Math.max(0,Math.floor(base.after.cash));p.save=Math.min(reports[i].plan.save,budget);p.invest=Math.min(reports[i].plan.invest,Math.max(0,budget-p.save));trimmed+=requested-p.save-p.invest;const r=settle(state,p,i,goal,true,difficulty);state=r.after;result.push(r);}}
  return {state,reports:result,trimmed};}
