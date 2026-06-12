export const STEPS = [
  {
    title: "Основна інформація",
    fields: ["name", "type", "edrpou"],
  },
  {
    title: "Контактні дані",
    fields: [
      "email",
      "phone_number",
      "city",
      "street",
      "building",
    ],
  },
  {
    title: "Пароль",
    fields: ["password", "confirm_password"],
  },
];

export const FIELDS_CONFIG = {
  name: {
    label: "Назва компанії",
    type: "text",
    placeholder: "ТОВ Екологія Плюс",
  },

  type: {
    label: "Тип діяльності",
    type: "select",
    options: [
      "ОСББ",
      "Приватна компанія",
      "Державне підприємство",
      "ФОП",
      "Інше",
    ],
  },

  edrpou: {
    label: "ЄДРПОУ",
    type: "text",
    placeholder: "12345678",
  },

  email: {
    label: "Email",
    type: "email",
    placeholder: "info@company.ua",
  },

  phone_number: {
    label: "Телефон",
    type: "tel",
    placeholder: "+38 (050) 123-45-67",
  },

  city: {
    label: "Місто",
    type: "text",
    placeholder: "Харків",
  },

  street: {
    label: "Вулиця",
    type: "text",
    placeholder: "вул. Сумська",
  },

  building: {
    label: "Будинок",
    type: "text",
    placeholder: "12",
  },

  password: {
    label: "Пароль",
    type: "password",
    placeholder: "Мінімум 6 символів",
  },

  confirm_password: {
    label: "Підтвердіть пароль",
    type: "password",
    placeholder: "Повторіть пароль",
  },
};