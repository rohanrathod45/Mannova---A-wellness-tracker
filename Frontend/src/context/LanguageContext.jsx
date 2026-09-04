import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        return user.language || "English";
      } catch (e) {
        return "English";
      }
    }
    return localStorage.getItem("language") || "English";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    const handleProfileUpdate = (event) => {
      const updatedUser = event.detail?.user;
      if (updatedUser?.language) {
        setLanguage(updatedUser.language);
      }
    };
    window.addEventListener("profileUpdated", handleProfileUpdate);
    return () => window.removeEventListener("profileUpdated", handleProfileUpdate);
  }, []);

  const t = (key) => {
    const translations = {
      English: {
        // Navbar & BottomNav
        home: "Home",
        mood: "Mood",
        exercises: "Exercises",
        support: "Support",
        progress: "Progress",
        profile: "Profile",
        logout: "Logout",
        // General UI
        edit_profile: "Edit Profile",
        account_settings: "Account Settings",
        notifications: "Notification Settings",
        privacy: "Privacy",
        theme: "Theme",
        language: "Language",
        help: "Help & Support",
        manage_plan: "Manage Plan",
        membership: "Membership",
        save: "Save Changes",
        cancel: "Cancel",
        close: "Close",
        name: "Full Name",
        age: "Age",
        gender: "Gender",
        wellness_streak: "Wellness Streak",
        sessions: "Sessions",
        minutes: "Minutes",
        premium_badge: "Premium Member",
        free_badge: "Free Member",
        // Mood page
        how_feeling: "How are you feeling today?",
        save_mood: "Log Mood",
        mood_history: "Mood History",
        // Exercises
        breathing: "Breathing Exercise",
        start: "Start",
        // Chat
        chat_helper: "Mannova AI Companion",
        type_message: "Type a message...",
        send: "Send",
      },
      Spanish: {
        home: "Inicio",
        mood: "Estado de ánimo",
        exercises: "Ejercicios",
        support: "Soporte",
        progress: "Progreso",
        profile: "Perfil",
        logout: "Cerrar sesión",
        edit_profile: "Editar Perfil",
        account_settings: "Configuración de la cuenta",
        notifications: "Configuración de notificaciones",
        privacy: "Privacidad",
        theme: "Tema",
        language: "Idioma",
        help: "Ayuda y Soporte",
        manage_plan: "Gestionar Plan",
        membership: "Membresía",
        save: "Guardar cambios",
        cancel: "Cancelar",
        close: "Cerrar",
        name: "Nombre completo",
        age: "Edad",
        gender: "Género",
        wellness_streak: "Racha de bienestar",
        sessions: "Sesiones",
        minutes: "Minutos",
        premium_badge: "Miembro Premium",
        free_badge: "Miembro Gratis",
        how_feeling: "¿Cómo te sientes hoy?",
        save_mood: "Registrar ánimo",
        mood_history: "Historial de ánimo",
        breathing: "Ejercicio de respiración",
        start: "Comenzar",
        chat_helper: "Compañero AI de Mannova",
        type_message: "Escribe un mensaje...",
        send: "Enviar",
      },
      French: {
        home: "Accueil",
        mood: "Humeur",
        exercises: "Exercices",
        support: "Assistance",
        progress: "Progrès",
        profile: "Profil",
        logout: "Se déconnecter",
        edit_profile: "Modifier le profil",
        account_settings: "Paramètres du compte",
        notifications: "Paramètres de notification",
        privacy: "Confidentialité",
        theme: "Thème",
        language: "Langue",
        help: "Aide & Support",
        manage_plan: "Gérer le plan",
        membership: "Adhésion",
        save: "Enregistrer les modifications",
        cancel: "Annuler",
        close: "Fermer",
        name: "Nom complet",
        age: "Âge",
        gender: "Genre",
        wellness_streak: "Série de bien-être",
        sessions: "Sessions",
        minutes: "Minutes",
        premium_badge: "Membre Premium",
        free_badge: "Membre Gratuit",
        how_feeling: "Comment vous sentez-vous aujourd'hui?",
        save_mood: "Enregistrer l'humeur",
        mood_history: "Historique d'humeur",
        breathing: "Exercice de respiration",
        start: "Démarrer",
        chat_helper: "Compagnon IA de Mannova",
        type_message: "Écrivez un message...",
        send: "Envoyer",
      },
      German: {
        home: "Startseite",
        mood: "Stimmung",
        exercises: "Übungen",
        support: "Unterstützung",
        progress: "Fortschritt",
        profile: "Profil",
        logout: "Abmelden",
        edit_profile: "Profil bearbeiten",
        account_settings: "Kontoeinstellungen",
        notifications: "Benachrichtigungseinstellungen",
        privacy: "Datenschutz",
        theme: "Design",
        language: "Sprache",
        help: "Hilfe & Support",
        manage_plan: "Plan verwalten",
        membership: "Mitgliedschaft",
        save: "Änderungen speichern",
        cancel: "Abbrechen",
        close: "Schließen",
        name: "Vollständiger Name",
        age: "Alter",
        gender: "Geschlecht",
        wellness_streak: "Wellness-Strähne",
        sessions: "Sitzungen",
        minutes: "Minuten",
        premium_badge: "Premium-Mitglied",
        free_badge: "Kostenloses Mitglied",
        how_feeling: "Wie fühlst du dich heute?",
        save_mood: "Stimmung protokollieren",
        mood_history: "Stimmungsverlauf",
        breathing: "Atemübung",
        start: "Starten",
        chat_helper: "Mannova KI-Begleiter",
        type_message: "Nachricht schreiben...",
        send: "Senden",
      },
      Chinese: {
        home: "首页",
        mood: "情绪",
        exercises: "练习",
        support: "支持",
        progress: "进度",
        profile: "个人资料",
        logout: "退出登录",
        edit_profile: "编辑个人资料",
        account_settings: "账户设置",
        notifications: "通知设置",
        privacy: "隐私设置",
        theme: "主题",
        language: "语言",
        help: "帮助与支持",
        manage_plan: "管理计划",
        membership: "会员身份",
        save: "保存更改",
        cancel: "取消",
        close: "关闭",
        name: "姓名",
        age: "年龄",
        gender: "性别",
        wellness_streak: "健康打卡天数",
        sessions: "总次数",
        minutes: "总时长",
        premium_badge: "高级会员",
        free_badge: "免费会员",
        how_feeling: "您今天感觉如何？",
        save_mood: "记录情绪",
        mood_history: "情绪历史",
        breathing: "呼吸练习",
        start: "开始",
        chat_helper: "Mannova AI 伴侣",
        type_message: "输入消息...",
        send: "发送",
      },
      Hindi: {
        home: "होम",
        mood: "मनोदशा",
        exercises: "व्यायाम",
        support: "सहायता",
        progress: "प्रगति",
        profile: "प्रोफ़ाइल",
        logout: "लॉगआउट",
        edit_profile: "प्रोफ़ाइल संपादित करें",
        account_settings: "खाता सेटिंग",
        notifications: "अधिसूचना सेटिंग",
        privacy: "गोपनीयता",
        theme: "थीम",
        language: "भाषा",
        help: "सहायता एवं समर्थन",
        manage_plan: "योजना प्रबंधित करें",
        membership: "सदस्यता",
        save: "बदलाव सहेजें",
        cancel: "रद्द करें",
        close: "बंद करें",
        name: "पूरा नाम",
        age: "उम्र",
        gender: "लिंग",
        wellness_streak: "स्वास्थ्य का सिलसिला",
        sessions: "सत्र",
        minutes: "मिनट",
        premium_badge: "प्रीमियम सदस्य",
        free_badge: "मुफ़्त सदस्य",
        how_feeling: "आज आप कैसा महसूस कर रहे हैं?",
        save_mood: "मूड लॉग करें",
        mood_history: "मूड इतिहास",
        breathing: "श्वास व्यायाम",
        start: "शुरू करें",
        chat_helper: "मनोवा एआई साथी",
        type_message: "संदेश लिखें...",
        send: "भेजें",
      }
    };

    const langTranslations = translations[language] || translations.English;
    return langTranslations[key] || translations.English[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
