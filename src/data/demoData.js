// Демо-данные. А-1042…А-1047 прочитаны с видео; А-1048 восстановлена по счётчикам (см. ANALYSIS.md)
export const specialists = [
  {id:'sokolov',name:'Игорь Соколов',role:'Инженерные системы',district:'Центр',base:72,baseAssigned:1},
  {id:'kovaleva',name:'Марина Ковалёва',role:'Бытовая техника',district:'Северный',base:58,baseAssigned:1},
  {id:'lebedev',name:'Артём Лебедев',role:'Аварийные выезды',district:'Центр',base:86,baseAssigned:1},
  {id:'ershov',name:'Дмитрий Ершов',role:'Отопление, кондиционирование',district:'Заречье',base:44,baseAssigned:1},
  {id:'romanova',name:'Ольга Романова',role:'Сантехника',district:'Северный',base:31,baseAssigned:0}
];
export const initialRequests = () => [
  {id:'А-1042',title:'Протечка под мойкой',address:'ул. Гоголя, 12, кв. 34',district:'Центр',window:'09:00–11:00',type:'Сантехника',high:true,status:'new',spec:null},
  {id:'А-1043',title:'Не включается стиральная машина',address:'ул. Мира, 78, кв. 5',district:'Северный',window:'11:00–13:00',type:'Бытовая техника',high:false,status:'assigned',spec:'kovaleva'},
  {id:'А-1044',title:'Диагностика бойлера',address:'пер. Тихий, 4',district:'Заречье',window:'13:00–15:00',type:'Инженерные системы',high:false,status:'assigned',spec:'sokolov'},
  {id:'А-1045',title:'Аварийное отключение стояка',address:'ул. Строителей, 21',district:'Центр',window:'сейчас',type:'Аварийный выезд',high:true,status:'enroute',spec:'lebedev'},
  {id:'А-1046',title:'Замена смесителя',address:'ул. Лесная, 9, кв. 112',district:'Северный',window:'15:00–17:00',type:'Сантехника',high:false,status:'new',spec:null},
  {id:'А-1047',title:'Плановое обслуживание кондиционера',address:'ул. Заводская, 3',district:'Промзона',window:'08:00–10:00',type:'Обслуживание',high:false,status:'done',spec:'ershov'},
  {id:'А-1048',title:'Проверка электрощита',address:'ул. Речная, 15',district:'Заречье',window:'17:00–19:00',type:'Электрика',high:false,status:'new',spec:null}
];
export const statusLabel = {new:'Новая',assigned:'Назначена',enroute:'В пути',onsite:'На объекте',done:'Выполнена'};
export const nextStatus = {assigned:'enroute',enroute:'onsite',onsite:'done'};
export const nextLabel = {assigned:'Выехал',enroute:'На объекте',onsite:'Выполнена'};
export const districts = ['Центр','Северный','Заречье','Промзона'];
export const periods = {
  day:{label:'День',shift:14,closed:1,bars:[.38,.6,.45,.7,.55,.95,.78,.5,.18],labels:['08','10','12','14','16','18','20','22','']},
  week:{label:'Неделя',shift:86,closed:6,bars:[.62,.7,.55,.8,.9,.4,.3],labels:['Пн','Вт','Ср','Чт','Пт','Сб','Вс']},
  month:{label:'Месяц',shift:362,closed:21,bars:[.5,.62,.7,.66],labels:['Н1','Н2','Н3','Н4']}
};
