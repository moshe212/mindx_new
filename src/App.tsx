import React, { useState, useRef } from "react";
import {
  MessageCircle,
  BarChart,
  Users,
  Link2,
  Send,
  Upload,
  Briefcase,
  UserPlus,
  Info,
  Search,
  Zap,
  ChevronRight,
  PieChart,
  LineChart,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Percent,
  DollarSign,
  Clock,
  Target,
  Calendar,
} from "lucide-react";
import "./App.css";

// Define interfaces
interface Conversation {
  id: number;
  title: string;
  date: string;
  active: boolean;
}

interface WizardAnswers {
  [key: string]: string;
}

interface Message {
  content: string;
  role: "user" | "assistant" | "system";
  isProcessing?: boolean;
  sources?: string[];
}

// נתוני דמה למסך האנליזות
interface SalesData {
  month: string;
  מכירות: number;
  לידים: number;
  רווח: number;
}

interface ConversionStats {
  category: string;
  value: number;
  change: number;
}

interface PieChartData {
  label: string;
  value: number;
  color: string;
}

const App = () => {
  const [selectedTab, setSelectedTab] = useState<string>("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [wizardAnswers, setWizardAnswers] = useState<WizardAnswers>({});
  const [isProcessingRequest, setIsProcessingRequest] =
    useState<boolean>(false);

  const messageRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [selectedMode, setSelectedMode] = useState("dataRepository");
  const [selectedAgent, setSelectedAgent] = useState("free");
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [fluentChatEnabled, setFluentChatEnabled] = useState(true);
  const [semanticSearchEnabled, setSemanticSearchEnabled] = useState(true);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [tokenCount, setTokenCount] = useState(0);
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: 1, title: "שיחה על נתוני מכירות", date: "28/04/25", active: true },
    { id: 2, title: "ניתוח דוח כספי", date: "26/04/25", active: false },
    { id: 3, title: "תכנון אירוע חברה", date: "23/04/25", active: false },
    { id: 4, title: "תחזית רבעונית", date: "21/04/25", active: false },
    { id: 5, title: "נתוני משאבי אנוש", date: "18/04/25", active: false },
  ]);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedWizardType, setSelectedWizardType] = useState("");
  const [wizardCompleted, setWizardCompleted] = useState(false);
  const [selectedIntegrationTab, setSelectedIntegrationTab] = useState("data");

  // State חדש עבור מסך האנליזות
  const [selectedDateRange, setSelectedDateRange] = useState<string>("month");
  const [selectedMetric, setSelectedMetric] = useState<string>("sales");
  const [salesData] = useState<SalesData[]>([
    { month: "ינואר", מכירות: 420000, לידים: 820, רווח: 180000 },
    { month: "פברואר", מכירות: 490000, לידים: 890, רווח: 210000 },
    { month: "מרץ", מכירות: 520000, לידים: 950, רווח: 240000 },
    { month: "אפריל", מכירות: 480000, לידים: 910, רווח: 220000 },
    { month: "מאי", מכירות: 560000, לידים: 1050, רווח: 280000 },
    { month: "יוני", מכירות: 610000, לידים: 1120, רווח: 310000 },
    { month: "יולי", מכירות: 590000, לידים: 1080, רווח: 300000 },
    { month: "אוגוסט", מכירות: 640000, לידים: 1180, רווח: 330000 },
  ]);

  const [conversionStats] = useState<ConversionStats[]>([
    { category: "אחוז המרה", value: 18.4, change: 2.1 },
    { category: "מכירה ממוצעת", value: 5400, change: -1.2 },
    { category: "עלות רכישת לקוח", value: 840, change: -3.5 },
    { category: "זמן המרה ממוצע", value: 7.2, change: -0.8 },
  ]);

  const [productDistribution] = useState<PieChartData[]>([
    { label: "ניהול לקוחות", value: 32, color: "bg-cyan-500" },
    { label: "אבטחת מידע", value: 28, color: "bg-purple-500" },
    { label: "שירותי ענן", value: 24, color: "bg-amber-500" },
    { label: "פיתוח מותאם", value: 16, color: "bg-emerald-500" },
  ]);

  const [regionalSales] = useState<PieChartData[]>([
    { label: "צפון", value: 38, color: "bg-blue-500" },
    { label: "מרכז", value: 42, color: "bg-indigo-500" },
    { label: "ירושלים", value: 12, color: "bg-pink-500" },
    { label: "דרום", value: 8, color: "bg-red-500" },
  ]);

  // פונקציה לבחירת שיחה מההיסטוריה
  const selectConversation = (id: number): void => {
    // עדכון ההיסטוריה כך שרק השיחה הנבחרת תהיה פעילה
    const updatedHistory = conversations.map((conv) => ({
      ...conv,
      active: conv.id === id,
    }));
    setConversations(updatedHistory);

    // כאן בפרויקט אמיתי היינו טוענים את ההודעות של אותה שיחה מהשרת
    // לצורך הדגמה נשנה את ההודעות לפי השיחה שנבחרה
    if (id === 1) {
      setMessages([
        {
          content: "אני צריך לנתח את נתוני המכירות של החודש האחרון",
          role: "user",
        },
        {
          content:
            "בהתבסס על נתוני המכירות, חל גידול של 12% בהשוואה לחודש הקודם. המוצרים המובילים הם מערכת ניהול לקוחות (32%), פתרונות אבטחת מידע (28%), ושירותי ענן (24%).",
          role: "assistant",
          sources: ["מאגר מידע פנימי", "דוח מכירות"],
        },
        {
          content: "באילו אזורים בארץ חל הגידול המשמעותי ביותר?",
          role: "user",
        },
        {
          content:
            "הגידול המשמעותי ביותר נרשם באזור הצפון עם עלייה של 18%, אחריו אזור המרכז עם 15%, ואזור ירושלים עם 11%. אזור הדרום רשם את הגידול הנמוך ביותר עם 7% בלבד.",
          role: "assistant",
          sources: ["מאגר מידע פנימי", "דוח מכירות לפי אזורים"],
        },
        {
          content: "מה הציפייה לגבי המכירות ברבעון הבא?",
          role: "user",
        },
        {
          content:
            "לפי מודל התחזיות, צפויה המשך מגמת צמיחה של 8-10% ברבעון הבא. פתרונות אבטחת המידע צפויים להוביל את הצמיחה עם גידול של כ-15% בשל התגברות איומי הסייבר והדרישות הרגולטוריות החדשות. שירותי הענן צפויים גם הם להציג ביצועים חזקים עם צמיחה של 12%.",
          role: "assistant",
          sources: ["תחזית מכירות רבעונית", "ניתוח מגמות שוק", "דוח אנליסטים"],
        },
      ]);
    } else if (id === 2) {
      setMessages([
        {
          content: "אני צריך סיכום של הדוח הכספי האחרון",
          role: "user",
        },
        {
          content:
            "הדוח הכספי לרבעון האחרון מראה צמיחה של 8% בהכנסות וגידול של 5% ברווח התפעולי. ההוצאות גדלו ב-3% בהשוואה לרבעון המקביל אשתקד.",
          role: "assistant",
          sources: ["דוחות כספיים", "מאגר מידע פנימי"],
        },
        {
          content: "אילו תחומי פעילות היו הרווחיים ביותר?",
          role: "user",
        },
        {
          content:
            "התחומים הרווחיים ביותר היו: 1) פתרונות אבטחת מידע עם רווחיות של 34%, 2) שירותי ענן עם רווחיות של 28%, 3) פיתוח תוכנה מותאם אישית עם רווחיות של 22%. פעילות החומרה הייתה הפחות רווחית עם 12% בלבד.",
          role: "assistant",
          sources: ["דוחות כספיים", "ניתוח רווחיות מוצרים", "דוח פעילות עסקית"],
        },
        {
          content: "מה הסיכונים המרכזיים שצוינו בדוח?",
          role: "user",
        },
        {
          content:
            "הסיכונים המרכזיים שצוינו בדוח כוללים: 1) התגברות התחרות בשוק שירותי הענן עם כניסת שחקנים חדשים, 2) לחצי מחירים בתחום החומרה שעלולים להקטין את שולי הרווח, 3) עלייה בעלויות גיוס ושימור עובדים בתחום הפיתוח, 4) סיכוני סייבר גוברים המחייבים השקעות נוספות באבטחה, 5) השפעות אפשריות של האטה כלכלית על תקציבי IT של לקוחות.",
          role: "assistant",
          sources: ["דוח סיכונים", "דוחות כספיים", "הערכת מנהלים"],
        },
      ]);
    } else if (id === 3) {
      setMessages([
        {
          content: "אני צריך רעיונות לאירוע החברה השנתי",
          role: "user",
        },
        {
          content:
            "בהתבסס על משובי עובדים ומגמות עדכניות, הנה מספר רעיונות לאירוע החברה השנתי: 1) יום כיף הכולל פעילות ODT בטבע עם אתגרים קבוצתיים, 2) האקתון חברתי שמשלב פיתוח פתרונות לארגונים חברתיים, 3) ערב גאלה בנושא קיימות עם הרצאות השראה ופעילויות Team Building, 4) סדנאות אומנות וקריאייטיב שמעודדות חשיבה מחוץ לקופסה.",
          role: "assistant",
          sources: ["משובי עובדים", "מגמות HR", "אירועים קודמים"],
        },
        {
          content: "מה היה המשוב על האירוע של השנה שעברה?",
          role: "user",
        },
        {
          content:
            "המשוב על האירוע של השנה שעברה (סדנת בישול משותפת ואירוע ערב) היה חיובי בעיקרו, עם ציון ממוצע של 8.2 מתוך 10. הנקודות החזקות שצוינו היו האווירה הנעימה (92%), הזדמנות להכיר עמיתים ממחלקות אחרות (87%), והאוכל (85%). נקודות לשיפור כללו משך האירוע שהיה ארוך מדי לדעת חלק מהמשתתפים (32%), מיעוט פעילויות אקטיביות (28%), והצורך ביותר זמן חופשי לנטוורקינג (24%).",
          role: "assistant",
          sources: ["סיכום משוב אירוע", "דוח HR"],
        },
        {
          content: "כמה תקציב הוקצה לאירוע השנה?",
          role: "user",
        },
        {
          content:
            'התקציב שהוקצה לאירוע החברה השנה הוא 180,000 ₪, גידול של 15% בהשוואה לתקציב השנה שעברה שעמד על 156,000 ₪. החלוקה המומלצת היא: 40% למיקום ואירוח, 25% לקייטרינג והסעדה, 15% לפעילויות ותוכן, 10% למתנות ומזכרות לעובדים, ו-10% לשונות ובלת"מ.',
          role: "assistant",
          sources: [
            "תקציב שנתי מחלקת HR",
            "דוח הוצאות אירועים",
            "פרוטוקול ועדת תקציב",
          ],
        },
      ]);
    } else if (id === 4) {
      setMessages([
        {
          content: "הצג לי את התחזית הרבעונית העדכנית",
          role: "user",
        },
        {
          content:
            "התחזית הרבעונית העדכנית מראה צמיחה מתונה של 4.2% בהכנסות וגידול של 3.7% ברווח התפעולי לעומת הרבעון המקביל אשתקד. שולי הרווח הגולמי צפויים להישאר יציבים על 62%.",
          role: "assistant",
          sources: ["תחזית רבעונית", "מודל פיננסי", "נתוני מכירות"],
        },
        {
          content: "איך זה משתווה לתחזיות הקודמות?",
          role: "user",
        },
        {
          content:
            "התחזית הנוכחית מייצגת הורדה קלה בציפיות לעומת התחזית הקודמת, שעמדה על צמיחה של 5.8% בהכנסות ו-5.2% ברווח התפעולי. ההתאמה כלפי מטה נובעת בעיקר מעיכובים בהשקת שני מוצרים חדשים והאטה בהטמעת פרויקטים גדולים אצל שני לקוחות מרכזיים. עם זאת, שולי הרווח הגולמי נותרו יציבים, מה שמעיד על יעילות תפעולית טובה.",
          role: "assistant",
          sources: ["השוואת תחזיות", "דוח תפעולי", "עדכון מנהלים"],
        },
        {
          content: "אילו פעולות ננקטות כדי לעמוד ביעדים?",
          role: "user",
        },
        {
          content:
            "הפעולות העיקריות שננקטות כדי לעמוד ביעדים כוללות: 1) האצת לוחות הזמנים לפיתוח ב-15% באמצעות תגבור צוותי הפיתוח והנדסה, 2) תוכנית התייעלות תפעולית חוצת-ארגון שצפויה לחסוך כ-3.5% בהוצאות השוטפות, 3) תוכנית תמריצים מיוחדת לצוותי המכירות עבור סגירת עסקאות לפני סוף הרבעון, 4) התמקדות בהרחבת פתרונות אצל לקוחות קיימים (cross-selling), 5) האצת מאמצי השיווק הדיגיטלי עם תוספת תקציב של 150,000 ₪ לקמפיינים ממוקדים.",
          role: "assistant",
          sources: [
            "תוכנית פעולה עסקית",
            "פרוטוקול הנהלה",
            "עדכון תקציבי",
            "תוכנית מכירות רבעונית",
          ],
        },
      ]);
    } else if (id === 5) {
      setMessages([
        {
          content: "מה מצב כוח האדם בחברה כרגע?",
          role: "user",
        },
        {
          content:
            "מצבת כוח האדם בחברה עומדת כעת על 342 עובדים, גידול של 8% מתחילת השנה. החלוקה המחלקתית היא: פיתוח ומחקר - 135 עובדים, שיווק ומכירות - 87 עובדים, תמיכה טכנית - 64 עובדים, אדמיניסטרציה וכספים - 35 עובדים, אבטחת מידע - 21 עובדים.",
          role: "assistant",
          sources: ["מאגר מידע HR", "דוח מצבת עובדים"],
        },
        {
          content: "מה שיעור התחלופה בששת החודשים האחרונים?",
          role: "user",
        },
        {
          content:
            "שיעור התחלופה בששת החודשים האחרונים עמד על 7.2%, נמוך ב-2.1% מהתקופה המקבילה אשתקד. הפילוח לפי מחלקות מראה שוני משמעותי: במחלקת התמיכה הטכנית נרשמה התחלופה הגבוהה ביותר (12.5%), בעיקר בקרב עובדים עם ותק של פחות משנתיים. במחלקות הפיתוח והמחקר התחלופה נמוכה יחסית (4.8%), ובמחלקות האדמיניסטרציה והכספים נרשמה התחלופה הנמוכה ביותר (3.2%).",
          role: "assistant",
          sources: ["סיכום נתוני HR", "ניתוח תחלופת עובדים", "ראיונות עזיבה"],
        },
        {
          content: "איזה תקנים פתוחים יש כרגע ומה קצב הגיוס?",
          role: "user",
        },
        {
          content:
            "כרגע יש 27 תקנים פתוחים בחברה, מתוכם: 14 במחלקת הפיתוח והמחקר (בעיקר מפתחי Full Stack, מהנדסי DevOps ומומחי Data Science), 6 במחלקת השיווק והמכירות, 4 בתמיכה הטכנית, ו-3 באבטחת מידע. קצב הגיוס הממוצע עומד על 8.3 עובדים חדשים בחודש, כאשר זמן הגיוס הממוצע הוא 42 ימים. האתגר העיקרי בגיוס נמצא בתפקידי הפיתוח הבכירים, שם זמן הגיוס הממוצע מגיע ל-68 ימים.",
          role: "assistant",
          sources: ["דוח תקנים פתוחים", "סטטיסטיקות גיוס", "תוכנית צמיחה"],
        },
      ]);
    } else {
      // ברירת מחדל - שיחה ריקה חדשה
      setMessages([
        {
          content: "ברוך הבא למערכת הצ'אט של MindX. במה אוכל לעזור היום?",
          role: "assistant",
        },
      ]);
    }
  };

  // פונקציה להוספת שיחה חדשה
  const addNewConversation = () => {
    const newId = Math.max(...conversations.map((c) => c.id)) + 1;
    const newConversation = {
      id: newId,
      title: "שיחה חדשה",
      date: formatDateTime().split(" ")[0], // רק התאריך ללא השעה
      active: true,
    };

    // עדכון ההיסטוריה כך שהשיחה החדשה תהיה פעילה והשאר לא
    const updatedHistory = conversations.map((conv) => ({
      ...conv,
      active: false,
    }));
    setConversations([newConversation, ...updatedHistory]);

    // איפוס ההודעות לשיחה חדשה
    setMessages([
      {
        content: "ברוך הבא למערכת הצ'אט של MindX. במה אוכל לעזור היום?",
        role: "assistant",
      },
    ]);
  };

  // פונקציה לפתיחת האשף עם בחירת יועץ ספציפי
  const openAdvisorWizard = (advisorType: string): void => {
    setSelectedWizardType(advisorType);
    setWizardStep(1);
    setWizardCompleted(false);
    setWizardAnswers({
      question1: "",
      question2: "",
      question3: "",
    });
    setWizardOpen(true);
  };

  // פונקציה למעבר לשלב הבא באשף
  const handleNextStep = () => {
    if (wizardStep < 3) {
      setWizardStep(wizardStep + 1);
    } else {
      // סיום האשף והפקת התוצר
      completeWizard();
    }
  };

  // פונקציה לסיום האשף
  const completeWizard = () => {
    // כאן אפשר להוסיף לוגיקה ליצירת המסמך המבוקש
    // לדוגמה: שליחת הנתונים לשרת או יצירת מסמך בעזרת API

    // במקום להציג alert, נשנה את המצב במודל
    setWizardCompleted(true);

    // כאן אפשר להתחיל תהליך יצירת המסמך
    // לדוגמה: setTimeout להמחשת תהליך עיבוד שאורך זמן
    // setTimeout(() => {
    //   // פעולות לאחר סיום העיבוד
    // }, 2000);
  };

  // פונקציה לסגירת המודל
  const closeWizard = () => {
    setWizardOpen(false);
    // מאפס את מצב האשף
    setWizardCompleted(false);
  };

  // פונקציה לעדכון תשובות האשף
  const updateWizardAnswer = (question: string, value: string): void => {
    setWizardAnswers({
      ...wizardAnswers,
      [question]: value,
    });
  };

  // פונקציה להצגת שם היועץ לפי הסוג
  const getAdvisorName = (type: string): string => {
    switch (type) {
      case "policies":
        return "חוברת נהלים";
      case "proposal":
        return "הצעה למכרז";
      case "marketing":
        return "תוכנית שיווק";
      case "mailing":
        return "רשימת תפוצה";
      default:
        return "מסמך";
    }
  };

  // פונקציה להצגת שאלות האשף לפי סוג היועץ והשלב
  const getWizardQuestion = () => {
    if (selectedWizardType === "policies") {
      if (wizardStep === 1) return "מהו תחום העיסוק של העסק שלך?";
      if (wizardStep === 2) return "עבור איזו מחלקה נדרשים הנהלים?";
      if (wizardStep === 3)
        return "האם יש נקודות ספציפיות שיש לכלול בחוברת הנהלים?";
    } else if (selectedWizardType === "proposal") {
      if (wizardStep === 1) return "מהו התחום המקצועי של המכרז?";
      if (wizardStep === 2) return "מהו היקף העבודה והתקציב המשוער?";
      if (wizardStep === 3)
        return "מהם היתרונות היחסיים של החברה שלך במכרז זה?";
    } else if (selectedWizardType === "marketing") {
      if (wizardStep === 1)
        return "מהו המוצר או השירות שעבורו נדרשת תוכנית השיווק?";
      if (wizardStep === 2) return "מיהו קהל היעד העיקרי?";
      if (wizardStep === 3) return "מהו התקציב המיועד לשיווק?";
    } else if (selectedWizardType === "mailing") {
      if (wizardStep === 1)
        return "מהי מטרת רשימת התפוצה (מכירות, עדכונים, אירועים)?";
      if (wizardStep === 2) return "איזה סוג של קהל היעד תרצה לכלול ברשימה?";
      if (wizardStep === 3) return "כמה אנשי קשר תרצה לכלול ברשימה?";
    }
    return "נא למלא את הפרטים";
  };

  const handleTabChange = (tab: string): void => {
    setSelectedTab(tab);
  };

  const formatDateTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const year = now.getFullYear().toString().slice(-2);

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const handleSendMessage = (text = inputValue.trim()) => {
    if (text !== "") {
      // Clear any suggested questions when sending a new message
      setSuggestedQuestions([]);

      const userMessage: Message = {
        content: text,
        role: "user",
      };

      setMessages([...messages, userMessage]);
      setInputValue("");

      // First response - searching notification
      setTimeout(() => {
        const searchType = semanticSearchEnabled ? "סמנטי" : "רגיל";
        const processingMessage: Message = {
          content: `מעבד את השאלה "${text}" באמצעות חיפוש ${searchType}. מחפש במקורות: מאגר מידע פנימי, Google Drive, SharePoint. זמן משוער לסיום: 10-15 שניות.`,
          role: "system",
          isProcessing: true,
        };

        setMessages((prev) => [...prev, processingMessage]);

        // Second response - actual answer after 2 seconds
        setTimeout(() => {
          let answerText = "";
          let followupQuestions = [];

          // Generate different responses based on input and search type
          if (semanticSearchEnabled) {
            // תשובות לחיפוש סמנטי
            if (
              text.toLowerCase().includes("מכירות") ||
              text.toLowerCase().includes("sales")
            ) {
              answerText =
                "תוצאות חיפוש סמנטי: לפי נתוני המכירות האחרונים, חל גידול של 12% ברבעון הנוכחי בהשוואה לרבעון המקביל אשתקד. המוצרים המובילים הם:\n\n1. מערכת ניהול לקוחות - 32% מהמכירות\n2. פתרונות אבטחת מידע - 28% מהמכירות\n3. שירותי ענן - 24% מהמכירות\n\nהאזור עם הצמיחה המהירה ביותר הוא צפון הארץ עם גידול של 18%.";
              followupQuestions = [
                "מה התחזית למכירות ברבעון הבא?",
                "איך המכירות שלנו משתוות למתחרים?",
                "מהן המגמות במכירות שירותי הענן?",
              ];
            } else if (
              text.toLowerCase().includes("עובדים") ||
              text.toLowerCase().includes("כוח אדם") ||
              text.toLowerCase().includes("hr")
            ) {
              answerText =
                "תוצאות חיפוש סמנטי: מצבת כוח האדם בחברה עומדת כיום על 342 עובדים, גידול של 8% מתחילת השנה. החלוקה המחלקתית הנוכחית היא:\n\n- פיתוח ומחקר: 135 עובדים\n- שיווק ומכירות: 87 עובדים\n- תמיכה טכנית: 64 עובדים\n- אדמיניסטרציה וכספים: 35 עובדים\n- אבטחת מידע: 21 עובדים\n\nשיעור תחלופת העובדים השנתי עומד על 11%, נמוך ב-3% מהממוצע בענף.";
              followupQuestions = [
                "מה שיעור הגיוס החזוי לרבעון הבא?",
                "מהן המחלקות עם תחלופת העובדים הגבוהה ביותר?",
                "מהי עלות השכר הממוצעת לפי מחלקות?",
              ];
            } else {
              answerText =
                'תוצאות חיפוש סמנטי: בהתבסס על המידע שנמצא במאגרי החברה, ניתן לסכם את הנקודות העיקריות כדלקמן:\n\n1. הביצועים העסקיים מראים מגמת צמיחה יציבה ברבעון האחרון\n2. פרויקט "אופק" נמצא בשלבי פיתוח מתקדמים ועומד בלוחות הזמנים המתוכננים\n3. המעבר למערכת החדשה צפוי להסתיים תוך 45 ימים\n4. יש לשים לב לתאריכי היעד לרבעון הבא כפי שהוגדרו בתוכנית העבודה השנתית\n\nמומלץ לעיין במסמך האסטרטגיה הרבעוני לפרטים נוספים.';
              followupQuestions = [
                "מהם היעדים העיקריים לרבעון הבא?",
                'מה סטטוס הפיתוח של פרויקט "אופק"?',
                "האם יש סיכונים מרכזיים שיש להיערך אליהם?",
              ];
            }
          } else {
            // תשובות לחיפוש רגיל
            if (
              text.toLowerCase().includes("מכירות") ||
              text.toLowerCase().includes("sales")
            ) {
              answerText =
                "תוצאות חיפוש רגיל: נמצאו 42 התאמות למילות המפתח 'מכירות'. להלן התוצאות המובילות:\n\n- מסמך 'דוח מכירות רבעוני Q2 2023'\n- מצגת 'תחזית מכירות 2023-2024'\n- קובץ אקסל 'ניתוח מכירות לפי אזורים'\n- פרוטוקול 'ישיבת צוות מכירות מיום 15.6.2023'";
              followupQuestions = [
                "הצג לי את דוח המכירות הרבעוני",
                "מהן המגמות העיקריות בתחזית המכירות?",
                "איזה אזור מוביל במכירות?",
              ];
            } else if (
              text.toLowerCase().includes("עובדים") ||
              text.toLowerCase().includes("כוח אדם") ||
              text.toLowerCase().includes("hr")
            ) {
              answerText =
                "תוצאות חיפוש רגיל: נמצאו 27 התאמות למילות המפתח 'עובדים/כוח אדם'. להלן התוצאות המובילות:\n\n- מסמך 'מצבת כוח אדם 2023'\n- קובץ 'תכנון גיוסים שנתי'\n- מצגת 'מבנה ארגוני מעודכן'\n- תיקיית 'דוחות תחלופת עובדים'";
              followupQuestions = [
                "הצג לי את מצבת כוח האדם הנוכחית",
                "מהי תכנית הגיוסים לשנה הבאה?",
                "מהם שיעורי תחלופת העובדים לפי מחלקות?",
              ];
            } else {
              answerText =
                "תוצאות חיפוש רגיל: נמצאו 5 התאמות למילות המפתח שהוזנו. להלן התוצאות המובילות:\n\n- מסמך 'תכנית עבודה שנתית 2023'\n- תיקיית 'דוחות רבעוניים'\n- מצגת 'סטטוס פרויקטים Q2 2023'\n- קובץ 'יעדים ומדדים לשנת 2023'";
              followupQuestions = [
                "הצג לי את תכנית העבודה השנתית",
                "מהו סטטוס הפרויקטים העיקריים?",
                "הצג את היעדים והמדדים העדכניים",
              ];
            }
          }

          const finalAnswer: Message = {
            content: answerText,
            role: "assistant",
            sources: [
              "מאגר מידע פנימי",
              "Google Drive",
              "SharePoint",
              semanticSearchEnabled ? "מנוע חיפוש סמנטי" : "מנוע חיפוש רגיל",
            ],
          };

          setMessages((prev) => [...prev, finalAnswer]);

          // Set suggested questions if fluent chat is enabled
          if (fluentChatEnabled) {
            setSuggestedQuestions(followupQuestions);
          }
        }, 2000);
      }, 500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleModeChange = (mode: string): void => {
    setSelectedMode(mode);
    const modeMessages: { [key: string]: string } = {
      dataRepository: "תשובות שיתקבלו מעכשיו יתבססו על מאגר המידע",
      gptOnly: "תשובות שיתקבלו מעכשיו יתבססו על GPT בלבד",
      combined: "תשובות שיתקבלו מעכשיו יתבססו על משולבות",
    };

    setMessages([
      ...messages,
      {
        content: modeMessages[mode],
        role: "system" as const,
      },
    ]);
  };

  const handleAgentChange = (agent) => {
    if (agent === "add") {
      setIsAgentModalOpen(true);
    } else {
      setSelectedAgent(agent);
    }
  };

  // פונקציה לחישוב מספר טוקנים ביחס לאורך הטקסט - גרסה פשוטה ביותר
  const calculateTokenCount = (text: string): number => {
    // חישוב פשוט ביותר - כל תו שווה 100 טוקנים
    return text.length * 100;
  };

  // פונקציה לקביעת צבע לפי מספר הטוקנים
  const getTokenColor = (count: number): string => {
    if (count < 1000) return "text-green-400";
    if (count < 10000) return "text-green-300";
    if (count < 30000) return "text-yellow-400";
    if (count < 70000) return "text-orange-400";
    return "text-red-400";
  };

  // פונקציה לייעול הפרומפט - מחזירה פרומפט מקוצר
  const optimizePrompt = (currentText: string): string => {
    // מגוון פרומפטים מקוצרים לבחירה רנדומלית
    const shorterPrompts = [
      "תוכל לתת לי תקציר קצר של הנתונים העיקריים?",
      "הצג לי את המידע באופן תמציתי בנקודות",
      "סכם את זה בשלושה משפטים",
      "מה השורה התחתונה של הנתונים?",
      "תן לי תשובה של פסקה אחת בלבד",
    ];

    // אם הטקסט הנוכחי הוא שאלה, אז נשאיר את רוב התוכן שלו
    if (currentText.trim().endsWith("?")) {
      const words = currentText.split(" ");
      if (words.length > 10) {
        // משאירים רק את 7 המילים הראשונות והסימן שאלה
        return words.slice(0, 7).join(" ") + "?";
      }
      return currentText; // כבר קצר מספיק
    }

    // בוחר פרומפט רנדומלי מהרשימה
    return shorterPrompts[Math.floor(Math.random() * shorterPrompts.length)];
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = e.target.value;
    console.log("Input changed:", newValue);
    setInputValue(newValue);
  };

  // Function to render sources with proper types
  const renderSources = (source: string, idx: number) => {
    return (
      <span
        key={idx}
        className="inline-block bg-blue-900 text-blue-200 rounded-full px-3 py-1 text-xs mr-2 mb-2"
      >
        {source}
      </span>
    );
  };

  // פונקציות חדשות עבור מסך האנליזות
  const getFormattedValue = (value: number, metric: string): string => {
    if (metric === "percent") return `${value}%`;
    if (metric === "currency") return `₪${value.toLocaleString()}`;
    if (metric === "time") return `${value} ימים`;
    return value.toLocaleString();
  };

  const getChangeColor = (change: number): string => {
    if (change > 0) return "text-green-400";
    if (change < 0) return "text-red-400";
    return "text-gray-400";
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp size={16} className="text-green-400" />;
    if (change < 0) return <ArrowDown size={16} className="text-red-400" />;
    return null;
  };

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case "percent":
        return <Percent size={18} />;
      case "currency":
        return <DollarSign size={18} />;
      case "time":
        return <Clock size={18} />;
      default:
        return <Info size={18} />;
    }
  };

  return (
    <div
      className="flex flex-col h-screen bg-black text-right text-gray-100"
      dir="rtl"
    >
      {/* Header/Navigation */}
      <header className="bg-gray-900 shadow-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-cyan-400">MindX</span>
              <span className="text-sm bg-cyan-900 text-cyan-300 px-2 py-1 rounded">
                AI
              </span>
            </div>

            <nav className="flex space-x-1">
              <button
                className={`px-4 py-2 rounded-md flex items-center transition-all ${
                  selectedTab === "chat"
                    ? "bg-gray-800 text-cyan-400 border-b-2 border-cyan-400"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
                onClick={() => handleTabChange("chat")}
              >
                <MessageCircle size={18} className="ml-2" />
                <span>שיחה</span>
              </button>
              <button
                className={`px-4 py-2 rounded-md flex items-center transition-all ${
                  selectedTab === "analytics"
                    ? "bg-gray-800 text-cyan-400 border-b-2 border-cyan-400"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
                onClick={() => handleTabChange("analytics")}
              >
                <BarChart size={18} className="ml-2" />
                <span>אנליזות</span>
              </button>
              <button
                className={`px-4 py-2 rounded-md flex items-center transition-all ${
                  selectedTab === "business"
                    ? "bg-gray-800 text-cyan-400 border-b-2 border-cyan-400"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
                onClick={() => handleTabChange("business")}
              >
                <Briefcase size={18} className="ml-2" />
                <span>יועץ עסקי</span>
              </button>
              <button
                className={`px-4 py-2 rounded-md flex items-center transition-all ${
                  selectedTab === "dataInput"
                    ? "bg-gray-800 text-cyan-400 border-b-2 border-cyan-400"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
                onClick={() => handleTabChange("dataInput")}
              >
                <Upload size={18} className="ml-2" />
                <span>הזנת נתונים</span>
              </button>
              <button
                className={`px-4 py-2 rounded-md flex items-center transition-all ${
                  selectedTab === "users"
                    ? "bg-gray-800 text-cyan-400 border-b-2 border-cyan-400"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
                onClick={() => handleTabChange("users")}
              >
                <Users size={18} className="ml-2" />
                <span>משתמשים</span>
              </button>
              <button
                className={`px-4 py-2 rounded-md flex items-center transition-all ${
                  selectedTab === "integrations"
                    ? "bg-gray-800 text-cyan-400 border-b-2 border-cyan-400"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
                onClick={() => handleTabChange("integrations")}
              >
                <Link2 size={18} className="ml-2" />
                <span>אינטגרציות</span>
              </button>
            </nav>

            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-200">
                א
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow overflow-hidden bg-gray-900">
        {selectedTab === "chat" && (
          <div dir="rtl" className="flex h-full">
            {/* שורת אפשרויות ימנית */}
            <div className="w-64 p-4 border-l border-gray-700 flex flex-col overflow-y-auto">
              {/* היסטוריית שיחות */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-200">
                    היסטוריית שיחות
                  </h3>
                  <button
                    onClick={addNewConversation}
                    className="text-sm bg-cyan-600 hover:bg-cyan-700 text-white px-2 py-1 rounded transition-colors"
                  >
                    + חדש
                  </button>
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto mb-4 pr-1">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => selectConversation(conv.id)}
                      className={`p-2 rounded-lg cursor-pointer transition-all text-sm ${
                        conv.active
                          ? "bg-gray-800 border-r-2 border-cyan-400 text-cyan-100"
                          : "hover:bg-gray-800 text-gray-300"
                      }`}
                    >
                      <div className="font-medium truncate">{conv.title}</div>
                      <div className="text-xs text-gray-400">{conv.date}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* מצב התכתבות */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-200">
                  מצב התכתבות
                </h3>
                <div className="space-y-2">
                  <div
                    className={`p-2 rounded-lg cursor-pointer transition-all flex items-center ${
                      selectedMode === "dataRepository"
                        ? "bg-gray-800 border-r-4 border-cyan-400"
                        : "hover:bg-gray-800"
                    }`}
                    onClick={() => handleModeChange("dataRepository")}
                  >
                    <div
                      className={`w-4 h-4 rounded-full ml-2 ${
                        selectedMode === "dataRepository"
                          ? "bg-cyan-400"
                          : "border border-gray-500"
                      }`}
                    ></div>
                    <span className="text-gray-200">מאגר המידע</span>
                  </div>
                  <div
                    className={`p-2 rounded-lg cursor-pointer transition-all flex items-center ${
                      selectedMode === "gptOnly"
                        ? "bg-gray-800 border-r-4 border-cyan-400"
                        : "hover:bg-gray-800"
                    }`}
                    onClick={() => handleModeChange("gptOnly")}
                  >
                    <div
                      className={`w-4 h-4 rounded-full ml-2 ${
                        selectedMode === "gptOnly"
                          ? "bg-cyan-400"
                          : "border border-gray-500"
                      }`}
                    ></div>
                    <span className="text-gray-200">GPT ללא מאגר מידע</span>
                  </div>
                  <div
                    className={`p-2 rounded-lg cursor-pointer transition-all flex items-center ${
                      selectedMode === "combined"
                        ? "bg-gray-800 border-r-4 border-cyan-400"
                        : "hover:bg-gray-800"
                    }`}
                    onClick={() => handleModeChange("combined")}
                  >
                    <div
                      className={`w-4 h-4 rounded-full ml-2 ${
                        selectedMode === "combined"
                          ? "bg-cyan-400"
                          : "border border-gray-500"
                      }`}
                    ></div>
                    <span className="text-gray-200">שאלות משולבות</span>
                  </div>
                </div>
              </div>

              {/* שיחה קולחת */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-200">
                    שיחה קולחת
                  </h3>
                  <div
                    className={`w-10 h-5 rounded-full cursor-pointer transition-all flex items-center p-0.5 ${
                      fluentChatEnabled ? "bg-cyan-600" : "bg-gray-600"
                    }`}
                    onClick={() => setFluentChatEnabled(!fluentChatEnabled)}
                    style={{ direction: "ltr" }}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                        fluentChatEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    ></div>
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  במצב פעיל כל תשובה מלווה בהצעות לשאלות המשך
                </p>
              </div>

              {/* סוג חיפוש */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-200">
                    סוג חיפוש
                  </h3>
                  <div
                    className={`w-10 h-5 rounded-full cursor-pointer transition-all flex items-center p-0.5 ${
                      semanticSearchEnabled ? "bg-cyan-600" : "bg-gray-600"
                    }`}
                    onClick={() =>
                      setSemanticSearchEnabled(!semanticSearchEnabled)
                    }
                    style={{ direction: "ltr" }}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                        semanticSearchEnabled
                          ? "translate-x-5"
                          : "translate-x-0"
                      }`}
                    ></div>
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  {semanticSearchEnabled
                    ? "חיפוש סמנטי: מחפש לפי משמעות ותוכן"
                    : "חיפוש רגיל: מחפש לפי מילות מפתח בלבד"}
                </p>
              </div>

              {/* בחירת סוכן */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-200">
                  בחירת סוכן
                </h3>
                <div className="space-y-2">
                  <div
                    className={`p-2 rounded-lg cursor-pointer transition-all ${
                      selectedAgent === "free"
                        ? "bg-gray-800 border-r-4 border-cyan-400 text-cyan-100"
                        : "hover:bg-gray-800 text-gray-200"
                    }`}
                    onClick={() => handleAgentChange("free")}
                  >
                    חופשי
                  </div>
                  <div
                    className={`p-2 rounded-lg cursor-pointer transition-all ${
                      selectedAgent === "marketing"
                        ? "bg-gray-800 border-r-4 border-cyan-400 text-cyan-100"
                        : "hover:bg-gray-800 text-gray-200"
                    }`}
                    onClick={() => handleAgentChange("marketing")}
                  >
                    יועץ שיווקי
                  </div>
                  <div
                    className={`p-2 rounded-lg cursor-pointer transition-all ${
                      selectedAgent === "training"
                        ? "bg-gray-800 border-r-4 border-cyan-400 text-cyan-100"
                        : "hover:bg-gray-800 text-gray-200"
                    }`}
                    onClick={() => handleAgentChange("training")}
                  >
                    מאמן הדרכה
                  </div>
                  <div
                    className="p-2 rounded-lg cursor-pointer transition-all bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-cyan-400"
                    onClick={() => handleAgentChange("add")}
                  >
                    <UserPlus size={16} className="ml-1" />
                    <span>הוספת סוכן</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-grow p-4 flex flex-col h-full">
              <div className="flex-grow overflow-y-auto bg-gray-900 rounded-lg shadow-md mb-4 p-4 border border-gray-800">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-6 flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className="flex items-start gap-2 max-w-md">
                      {message.role !== "user" && (
                        <div className="w-8 h-8 rounded-full bg-cyan-700 flex-shrink-0 flex items-center justify-center text-cyan-100 font-bold">
                          AI
                        </div>
                      )}
                      <div
                        className={`p-4 rounded-lg relative ${
                          message.role === "user"
                            ? "bg-gray-800 text-gray-100 border border-gray-700"
                            : message.isProcessing
                            ? "bg-gray-800 border border-cyan-900 text-gray-300"
                            : "bg-gradient-to-br from-cyan-900 to-blue-900 text-gray-100"
                        }`}
                      >
                        <div className="whitespace-pre-wrap">
                          {message.content}
                        </div>
                        {message.sources && message.sources.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-gray-700 text-xs">
                            <div className="text-gray-400 mb-1">מקורות:</div>
                            <div className="flex flex-wrap">
                              {message.sources.map(renderSources)}
                            </div>
                          </div>
                        )}
                      </div>
                      {message.role === "user" && (
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center text-gray-300">
                          א
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="הקלד הודעה..."
                    className="flex-grow p-3 bg-gray-800 border border-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-500"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    className="mr-2 p-3 bg-cyan-600 text-gray-100 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <Send size={20} />
                  </button>
                </div>

                {/* תצוגת מספר הטוקנים - תמיד מוצגת */}
                <div className="text-xs text-gray-400 mt-1 pr-2 text-left flex items-center">
                  <span>טוקנים: </span>
                  <span
                    className={`mr-1 font-bold ${getTokenColor(
                      calculateTokenCount(inputValue)
                    )}`}
                  >
                    {calculateTokenCount(inputValue).toLocaleString()}
                  </span>

                  {/* אייקון לייעול הפרומפט כשמגיעים ל-30,000 טוקנים */}
                  {calculateTokenCount(inputValue) >= 30000 && (
                    <div
                      className="cursor-pointer ml-2 bg-gray-700 hover:bg-cyan-800 rounded-full p-1 transition-all flex items-center justify-center group relative"
                      onClick={() => setInputValue(optimizePrompt(inputValue))}
                      title="לחץ לייעול הפרומפט"
                    >
                      <Zap size={14} className="text-yellow-400" />
                      <div className="hidden group-hover:block absolute left-0 -translate-y-full -translate-x-1/3 bottom-6 bg-gray-800 text-gray-300 text-xs rounded p-2 shadow-lg border border-gray-700 whitespace-nowrap z-10 w-32">
                        לחץ לקבלת פרומפט מקוצר ויעיל יותר
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Suggested follow-up questions */}
              {suggestedQuestions.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(question)}
                      className="bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg px-3 py-2 text-sm transition-colors border border-gray-600"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Business Advisor Screen */}
        {selectedTab === "business" && (
          <div
            className="h-full flex flex-col overflow-y-auto bg-gray-900 p-6"
            dir="rtl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-100">יועץ עסקי</h2>
              <button className="bg-cyan-600 text-gray-100 px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors flex items-center">
                <UserPlus size={18} className="ml-2" />
                הוסף יועץ
              </button>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-cyan-700 flex items-center justify-center text-cyan-100 font-bold mr-4">
                  <Briefcase size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-100">
                    יועץ עסקי חכם
                  </h3>
                  <p className="text-gray-400">
                    מומחה ליצירה והפקה של תוכן עסקי מקצועי
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 cursor-pointer transition-all"
                  onClick={() => openAdvisorWizard("policies")}
                >
                  <h4 className="text-cyan-300 font-semibold mb-2">
                    חוברת נהלים
                  </h4>
                  <p className="text-gray-300">
                    יצירה וארגון של נהלי עבודה מקצועיים לעסק שלך
                  </p>
                </div>
                <div
                  className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 cursor-pointer transition-all"
                  onClick={() => openAdvisorWizard("proposal")}
                >
                  <h4 className="text-cyan-300 font-semibold mb-2">
                    הצעה למכרז
                  </h4>
                  <p className="text-gray-300">
                    בניית הצעות מקצועיות ותחרותיות למכרזים עסקיים
                  </p>
                </div>
                <div
                  className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 cursor-pointer transition-all"
                  onClick={() => openAdvisorWizard("marketing")}
                >
                  <h4 className="text-cyan-300 font-semibold mb-2">
                    תוכנית שיווק
                  </h4>
                  <p className="text-gray-300">
                    פיתוח אסטרטגיות שיווק אפקטיביות להגדלת החשיפה והמכירות
                  </p>
                </div>
                <div
                  className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 cursor-pointer transition-all"
                  onClick={() => openAdvisorWizard("mailing")}
                >
                  <h4 className="text-cyan-300 font-semibold mb-2">
                    מחולל רשימת תפוצה
                  </h4>
                  <p className="text-gray-300">
                    יצירה וניהול של רשימות תפוצה ממוקדות לקמפיינים שיווקיים
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Input Screen */}
        {selectedTab === "dataInput" && (
          <div className="h-full flex bg-gray-900" dir="rtl">
            <div className="w-64 bg-gray-900 border-l border-gray-700 overflow-y-auto p-4">
              <div className="space-y-3">
                <div className="p-2 rounded-lg cursor-pointer bg-gray-800 text-cyan-400 border-r-2 border-cyan-500">
                  מסמכים טקסטואליים
                </div>
                <div className="p-2 rounded-lg cursor-pointer hover:bg-gray-800 text-gray-300">
                  טעינת אקסלים
                </div>
                <div className="p-2 rounded-lg cursor-pointer hover:bg-gray-800 text-gray-300">
                  העלאת תמונות
                </div>
                <div className="p-2 rounded-lg cursor-pointer hover:bg-gray-800 text-gray-300">
                  קבצי קול
                </div>
                <div className="p-2 rounded-lg cursor-pointer hover:bg-gray-800 text-gray-300">
                  הקלטות פגישות
                </div>
                <div className="p-2 rounded-lg cursor-pointer hover:bg-gray-800 text-gray-300">
                  הקלטות שיחות טלפוניות
                </div>
                <div className="p-2 rounded-lg cursor-pointer hover:bg-gray-800 text-gray-300">
                  מסמכים סרוקים
                </div>
                <div className="p-2 rounded-lg cursor-pointer hover:bg-gray-800 text-gray-300">
                  קישור לדף אינטרנט
                </div>
                <div className="p-2 rounded-lg cursor-pointer hover:bg-gray-800 text-gray-300">
                  מיוחדים
                </div>
              </div>
            </div>
            <div className="flex-grow p-6 text-gray-100">
              <h2 className="text-2xl font-bold mb-2">הזנת נתונים</h2>
              <p className="text-gray-400 mb-6">
                העלה קבצים או הזן מידע למערכת
              </p>

              <div className="border-2 border-dashed border-gray-700 rounded-lg p-10 flex flex-col items-center justify-center bg-gray-800">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-cyan-400 mb-4">
                  <Upload size={30} />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-200">
                  גרור ושחרר קבצים כאן
                </h3>
                <p className="text-gray-400 mb-4 text-center">
                  או לחץ על הכפתור לבחירת קבצים מהמחשב
                </p>

                <button className="bg-cyan-600 text-gray-100 px-6 py-3 rounded-lg hover:bg-cyan-700 transition-colors">
                  בחר קבצים
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Screen */}
        {selectedTab === "users" && (
          <div
            className="h-full flex flex-col overflow-y-auto bg-gray-900 p-6"
            dir="rtl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-100">
                ניהול משתמשים
              </h2>
              <button className="bg-cyan-600 text-gray-100 px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors flex items-center">
                <UserPlus size={18} className="ml-2" />
                הוסף משתמש
              </button>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase">
                      שם
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase">
                      אימייל
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase">
                      תפקיד
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase">
                      סטטוס
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase">
                      פעולות
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <tr key={i} className="hover:bg-gray-700">
                      <td className="px-6 py-4 text-gray-300">משתמש {i + 1}</td>
                      <td className="px-6 py-4 text-gray-300">
                        user{i + 1}@example.com
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {i === 0 ? "מנהל" : "משתמש"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            i % 4 !== 3
                              ? "bg-green-900 text-green-300"
                              : "bg-red-900 text-red-300"
                          }`}
                        >
                          {i % 4 !== 3 ? "פעיל" : "לא פעיל"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button className="text-cyan-400 hover:text-cyan-300">
                            ערוך
                          </button>
                          <button className="text-red-400 hover:text-red-300">
                            מחק
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Integrations Screen */}
        {selectedTab === "integrations" && (
          <div
            className="h-full flex flex-col overflow-y-auto bg-gray-900 p-6"
            dir="rtl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-100">אינטגרציות</h2>
            </div>

            {/* התאבים של האינטגרציות */}
            <div className="flex border-b border-gray-700 mb-6">
              <button
                className={`py-3 px-6 font-medium ${
                  selectedIntegrationTab === "data"
                    ? "text-cyan-400 border-b-2 border-cyan-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
                onClick={() => setSelectedIntegrationTab("data")}
              >
                מקורות נתונים
              </button>
              <button
                className={`py-3 px-6 font-medium ${
                  selectedIntegrationTab === "language"
                    ? "text-cyan-400 border-b-2 border-cyan-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
                onClick={() => setSelectedIntegrationTab("language")}
              >
                מנועי שפה
              </button>
              <button
                className={`py-3 px-6 font-medium ${
                  selectedIntegrationTab === "api"
                    ? "text-cyan-400 border-b-2 border-cyan-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
                onClick={() => setSelectedIntegrationTab("api")}
              >
                API
              </button>
            </div>

            {/* מקורות נתונים */}
            {selectedIntegrationTab === "data" && (
              <div className="flex flex-wrap -mx-2">
                {[
                  { name: "Google Drive", icon: <Link2 size={20} /> },
                  { name: "Dropbox", icon: <Link2 size={20} /> },
                  { name: "SharePoint", icon: <Link2 size={20} /> },
                  { name: "One Drive", icon: <Link2 size={20} /> },
                  { name: "MySQL", icon: <Link2 size={20} /> },
                  { name: "Postgres", icon: <Link2 size={20} /> },
                  { name: "פריוריטי", icon: <Link2 size={20} /> },
                  { name: "פיירברי", icon: <Link2 size={20} /> },
                  { name: "מיקרוסופט 365", icon: <Link2 size={20} /> },
                ].map((integration, i) => (
                  <div key={i} className="w-full md:w-1/2 lg:w-1/3 px-2 mb-4">
                    <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800 h-full">
                      <div className="bg-gray-800 p-4 flex items-center border-b border-gray-700">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-cyan-400 mr-3">
                          {integration.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-200">
                            {integration.name}
                          </h3>
                          <p className="text-xs text-gray-400">מקור נתונים</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-400 mb-4">
                          חיבור ל{integration.name} מאפשר גישה למסמכים ולנתונים
                          בענן
                        </p>

                        <div className="flex flex-wrap gap-2">
                          <button className="flex-grow bg-cyan-600 text-gray-100 px-3 py-2 rounded-md hover:bg-cyan-700 transition-colors text-sm">
                            {i % 2 === 0 ? "התחבר" : "סנכרן עכשיו"}
                          </button>
                          {i % 2 !== 0 && (
                            <button className="flex-grow bg-gray-700 text-gray-300 px-3 py-2 rounded-md hover:bg-gray-600 transition-colors text-sm">
                              הגדרות
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* מנועי שפה */}
            {selectedIntegrationTab === "language" && (
              <div className="flex flex-wrap -mx-2">
                {[
                  { name: "OpenAI GPT-4", icon: <Zap size={20} /> },
                  { name: "Claude 3", icon: <Zap size={20} /> },
                  { name: "Gemini Pro", icon: <Zap size={20} /> },
                  { name: "Mistral Large", icon: <Zap size={20} /> },
                  { name: "LLAMA 3", icon: <Zap size={20} /> },
                  { name: "HuggingFace", icon: <Zap size={20} /> },
                ].map((integration, i) => (
                  <div key={i} className="w-full md:w-1/2 lg:w-1/3 px-2 mb-4">
                    <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800 h-full">
                      <div className="bg-gray-800 p-4 flex items-center border-b border-gray-700">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-yellow-400 mr-3">
                          {integration.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-200">
                            {integration.name}
                          </h3>
                          <p className="text-xs text-gray-400">מנוע שפה</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-400 mb-4">
                          חיבור ל{integration.name} מאפשר עיבוד טקסט ויצירת תוכן
                          מתקדם
                        </p>

                        <div className="flex flex-wrap gap-2">
                          <button className="flex-grow bg-cyan-600 text-gray-100 px-3 py-2 rounded-md hover:bg-cyan-700 transition-colors text-sm">
                            {i % 2 === 0 ? "התחבר" : "הגדר מפתח API"}
                          </button>
                          {i % 2 !== 0 && (
                            <button className="flex-grow bg-gray-700 text-gray-300 px-3 py-2 rounded-md hover:bg-gray-600 transition-colors text-sm">
                              הגדרות מתקדמות
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* חיבורי API */}
            {selectedIntegrationTab === "api" && (
              <div className="flex flex-wrap -mx-2">
                {[
                  { name: "Salesforce", icon: <Link2 size={20} /> },
                  { name: "Slack", icon: <Link2 size={20} /> },
                  { name: "Zoom", icon: <Link2 size={20} /> },
                  { name: "GitHub", icon: <Link2 size={20} /> },
                  { name: "LinkedIn", icon: <Link2 size={20} /> },
                  { name: "Twitter", icon: <Link2 size={20} /> },
                  { name: "Make", icon: <Link2 size={20} /> },
                  { name: "Zapier", icon: <Link2 size={20} /> },
                ].map((integration, i) => (
                  <div key={i} className="w-full md:w-1/2 lg:w-1/3 px-2 mb-4">
                    <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800 h-full">
                      <div className="bg-gray-800 p-4 flex items-center border-b border-gray-700">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-green-400 mr-3">
                          {integration.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-200">
                            {integration.name}
                          </h3>
                          <p className="text-xs text-gray-400">חיבור API</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-400 mb-4">
                          חיבור ל{integration.name} מאפשר אינטגרציה עם שירותי צד
                          שלישי
                        </p>

                        <div className="flex flex-wrap gap-2">
                          <button className="flex-grow bg-cyan-600 text-gray-100 px-3 py-2 rounded-md hover:bg-cyan-700 transition-colors text-sm">
                            {i % 2 === 0 ? "אשר חיבור" : "התחבר"}
                          </button>
                          {i % 2 !== 0 && (
                            <button className="flex-grow bg-gray-700 text-gray-300 px-3 py-2 rounded-md hover:bg-gray-600 transition-colors text-sm">
                              הגדרות Webhook
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Analytics Screen */}
        {selectedTab === "analytics" && (
          <div
            className="h-full flex flex-col overflow-y-auto bg-gray-900 p-6"
            dir="rtl"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-100">
                  מדדים ואנליטיקה
                </h2>
                <p className="text-gray-400">
                  ניתוח ביצועים עסקיים ומדדי KPI מרכזיים
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex bg-gray-800 rounded-lg border border-gray-700 p-1">
                  <button
                    className={`px-4 py-2 rounded-md text-sm transition-all ${
                      selectedDateRange === "week"
                        ? "bg-gray-700 text-cyan-400"
                        : "text-gray-300"
                    }`}
                    onClick={() => setSelectedDateRange("week")}
                  >
                    שבוע
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md text-sm transition-all ${
                      selectedDateRange === "month"
                        ? "bg-gray-700 text-cyan-400"
                        : "text-gray-300"
                    }`}
                    onClick={() => setSelectedDateRange("month")}
                  >
                    חודש
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md text-sm transition-all ${
                      selectedDateRange === "quarter"
                        ? "bg-gray-700 text-cyan-400"
                        : "text-gray-300"
                    }`}
                    onClick={() => setSelectedDateRange("quarter")}
                  >
                    רבעון
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md text-sm transition-all ${
                      selectedDateRange === "year"
                        ? "bg-gray-700 text-cyan-400"
                        : "text-gray-300"
                    }`}
                    onClick={() => setSelectedDateRange("year")}
                  >
                    שנה
                  </button>
                </div>
                <button className="flex items-center bg-gray-800 border border-gray-700 rounded-lg p-2 text-gray-300 hover:bg-gray-700">
                  <Calendar size={18} className="ml-2" />
                  <span>תאריך מותאם</span>
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg border border-blue-700 shadow-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-blue-300 font-medium mb-1">
                      סה"כ מכירות
                    </p>
                    <h3 className="text-3xl font-bold text-white">₪4.6M</h3>
                    <div className="flex items-center mt-1 text-sm">
                      <ArrowUp size={16} className="text-green-400 mr-1" />
                      <span className="text-green-400 font-medium">12.5%</span>
                      <span className="text-blue-300 mr-1">מהרבעון הקודם</span>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-800 rounded-lg border border-blue-600">
                    <DollarSign size={24} className="text-blue-300" />
                  </div>
                </div>
                <div className="mt-4 h-10">
                  <div className="flex justify-between text-xs text-blue-300 mb-1">
                    <span>מטרה: ₪5M</span>
                    <span>92%</span>
                  </div>
                  <div className="w-full bg-blue-950 rounded-full h-2">
                    <div
                      className="bg-blue-400 h-2 rounded-full"
                      style={{ width: "92%" }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg border border-purple-700 shadow-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-purple-300 font-medium mb-1">
                      לקוחות חדשים
                    </p>
                    <h3 className="text-3xl font-bold text-white">842</h3>
                    <div className="flex items-center mt-1 text-sm">
                      <ArrowUp size={16} className="text-green-400 mr-1" />
                      <span className="text-green-400 font-medium">8.7%</span>
                      <span className="text-purple-300 mr-1">
                        מהרבעון הקודם
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-purple-800 rounded-lg border border-purple-600">
                    <Users size={24} className="text-purple-300" />
                  </div>
                </div>
                <div className="mt-4 h-10">
                  <div className="flex justify-between text-xs text-purple-300 mb-1">
                    <span>מטרה: 1000</span>
                    <span>84.2%</span>
                  </div>
                  <div className="w-full bg-purple-950 rounded-full h-2">
                    <div
                      className="bg-purple-400 h-2 rounded-full"
                      style={{ width: "84.2%" }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-900 to-amber-800 rounded-lg border border-amber-700 shadow-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-amber-300 font-medium mb-1">
                      אחוז המרה ממוצע
                    </p>
                    <h3 className="text-3xl font-bold text-white">18.4%</h3>
                    <div className="flex items-center mt-1 text-sm">
                      <ArrowUp size={16} className="text-green-400 mr-1" />
                      <span className="text-green-400 font-medium">2.1%</span>
                      <span className="text-amber-300 mr-1">מהרבעון הקודם</span>
                    </div>
                  </div>
                  <div className="p-3 bg-amber-800 rounded-lg border border-amber-600">
                    <Percent size={24} className="text-amber-300" />
                  </div>
                </div>
                <div className="mt-4 h-10">
                  <div className="flex justify-between text-xs text-amber-300 mb-1">
                    <span>מטרה: 20%</span>
                    <span>92%</span>
                  </div>
                  <div className="w-full bg-amber-950 rounded-full h-2">
                    <div
                      className="bg-amber-400 h-2 rounded-full"
                      style={{ width: "92%" }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 rounded-lg border border-emerald-700 shadow-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-emerald-300 font-medium mb-1">
                      רווח תפעולי
                    </p>
                    <h3 className="text-3xl font-bold text-white">₪1.87M</h3>
                    <div className="flex items-center mt-1 text-sm">
                      <ArrowUp size={16} className="text-green-400 mr-1" />
                      <span className="text-green-400 font-medium">5.3%</span>
                      <span className="text-emerald-300 mr-1">
                        מהרבעון הקודם
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-emerald-800 rounded-lg border border-emerald-600">
                    <TrendingUp size={24} className="text-emerald-300" />
                  </div>
                </div>
                <div className="mt-4 h-10">
                  <div className="flex justify-between text-xs text-emerald-300 mb-1">
                    <span>מטרה: ₪2M</span>
                    <span>93.5%</span>
                  </div>
                  <div className="w-full bg-emerald-950 rounded-full h-2">
                    <div
                      className="bg-emerald-400 h-2 rounded-full"
                      style={{ width: "93.5%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Main Chart */}
              <div className="lg:col-span-2 bg-gray-800 rounded-lg border border-gray-700 shadow-md">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                  <h3 className="font-bold text-gray-100">מגמות לאורך זמן</h3>
                  <div className="flex bg-gray-700 rounded-lg p-1">
                    <button
                      className={`px-3 py-1 rounded-md text-xs transition-all ${
                        selectedMetric === "sales"
                          ? "bg-gray-600 text-cyan-400"
                          : "text-gray-300"
                      }`}
                      onClick={() => setSelectedMetric("sales")}
                    >
                      מכירות
                    </button>
                    <button
                      className={`px-3 py-1 rounded-md text-xs transition-all ${
                        selectedMetric === "leads"
                          ? "bg-gray-600 text-cyan-400"
                          : "text-gray-300"
                      }`}
                      onClick={() => setSelectedMetric("leads")}
                    >
                      לידים
                    </button>
                    <button
                      className={`px-3 py-1 rounded-md text-xs transition-all ${
                        selectedMetric === "profit"
                          ? "bg-gray-600 text-cyan-400"
                          : "text-gray-300"
                      }`}
                      onClick={() => setSelectedMetric("profit")}
                    >
                      רווח
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-cyan-500 mr-1"></span>
                      <span>מכירות</span>
                    </div>
                    {selectedMetric !== "sales" && (
                      <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-purple-500 mr-1"></span>
                        <span>
                          {selectedMetric === "leads" ? "לידים" : "רווח"}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="h-64 mt-4 relative">
                    {/* ציור גרף לדוגמה */}
                    <div className="absolute bottom-0 left-0 right-0 h-64">
                      <div className="flex h-full items-end">
                        {salesData.map((data, index) => (
                          <div
                            key={index}
                            className="flex-1 flex flex-col items-center"
                          >
                            <div className="w-full relative flex justify-center group">
                              <div
                                className="w-4/5 bg-cyan-500 rounded-t opacity-80 group-hover:opacity-100 transition-all"
                                style={{
                                  height: `${(data.מכירות / 700000) * 100}%`,
                                  maxHeight: "90%",
                                }}
                              ></div>
                              {selectedMetric !== "sales" && (
                                <div
                                  className={`w-4/5 absolute left-1/2 transform -translate-x-1/2 rounded-t opacity-60 group-hover:opacity-80 transition-all ${
                                    selectedMetric === "leads"
                                      ? "bg-purple-500"
                                      : "bg-emerald-500"
                                  }`}
                                  style={{
                                    height: `${
                                      selectedMetric === "leads"
                                        ? (data.לידים / 1300) * 100
                                        : (data.רווח / 350000) * 100
                                    }%`,
                                    maxHeight: "90%",
                                  }}
                                ></div>
                              )}
                              <div className="absolute bottom-full opacity-0 group-hover:opacity-100 bg-gray-700 text-white text-xs rounded p-1 mb-2 transition-opacity">
                                {selectedMetric === "sales" &&
                                  `₪${data.מכירות.toLocaleString()}`}
                                {selectedMetric === "leads" &&
                                  `${data.לידים.toLocaleString()}`}
                                {selectedMetric === "profit" &&
                                  `₪${data.רווח.toLocaleString()}`}
                              </div>
                            </div>
                            <span className="text-xs text-gray-400 mt-2">
                              {data.month}
                            </span>
                          </div>
                        ))}
                      </div>
                      {/* גריד רקע */}
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                        {[0, 1, 2, 3, 4].map((_, i) => (
                          <div
                            key={i}
                            className="border-t border-gray-700 w-full h-0"
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conversion Stats */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-md">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                  <h3 className="font-bold text-gray-100">מדדי המרה</h3>
                  <button className="text-xs text-cyan-400 hover:text-cyan-300">
                    הצג דוח מלא
                  </button>
                </div>
                <div className="p-2">
                  {conversionStats.map((stat, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="p-2 mr-2 bg-gray-700 rounded-lg">
                            {stat.category === "אחוז המרה" && (
                              <Percent size={18} className="text-amber-400" />
                            )}
                            {stat.category === "מכירה ממוצעת" && (
                              <DollarSign
                                size={18}
                                className="text-green-400"
                              />
                            )}
                            {stat.category === "עלות רכישת לקוח" && (
                              <Users size={18} className="text-red-400" />
                            )}
                            {stat.category === "זמן המרה ממוצע" && (
                              <Clock size={18} className="text-blue-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-gray-300">
                              {stat.category}
                            </p>
                            <p className="text-lg font-semibold text-gray-100">
                              {stat.category === "אחוז המרה" &&
                                `${stat.value}%`}
                              {stat.category === "מכירה ממוצעת" &&
                                `₪${stat.value.toLocaleString()}`}
                              {stat.category === "עלות רכישת לקוח" &&
                                `₪${stat.value.toLocaleString()}`}
                              {stat.category === "זמן המרה ממוצע" &&
                                `${stat.value} ימים`}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`flex items-center ${getChangeColor(
                            stat.change
                          )}`}
                        >
                          {getChangeIcon(stat.change)}
                          <span className="font-medium">
                            {Math.abs(stat.change)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Product Distribution */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-md">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                  <h3 className="font-bold text-gray-100">
                    התפלגות מכירות לפי מוצר
                  </h3>
                  <div className="bg-gray-700 p-1 rounded-lg">
                    <PieChart size={20} className="text-gray-300" />
                  </div>
                </div>
                <div className="p-4 flex">
                  <div className="w-1/2 relative flex items-center justify-center">
                    {/* דיאגרמת עוגה - מיוצגת באופן פשוט לצורך הדגמה */}
                    <div className="w-40 h-40 rounded-full overflow-hidden relative">
                      <div
                        className="absolute inset-0"
                        style={{
                          clipPath:
                            "polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 0)",
                          backgroundColor: "#0ea5e9",
                          transform: "rotate(0deg)",
                        }}
                      ></div>
                      <div
                        className="absolute inset-0"
                        style={{
                          clipPath:
                            "polygon(50% 50%, 100% 0, 100% 100%, 0 100%)",
                          backgroundColor: "#a855f7",
                          transform: "rotate(115deg)",
                        }}
                      ></div>
                      <div
                        className="absolute inset-0"
                        style={{
                          clipPath: "polygon(50% 50%, 0 0, 100% 0)",
                          backgroundColor: "#f59e0b",
                          transform: "rotate(208deg)",
                        }}
                      ></div>
                      <div
                        className="absolute inset-0"
                        style={{
                          clipPath: "polygon(50% 50%, 0 0, 100% 0)",
                          backgroundColor: "#10b981",
                          transform: "rotate(294deg)",
                        }}
                      ></div>
                      <div className="absolute inset-3 bg-gray-800 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-200">
                          100%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-1/2">
                    <ul className="space-y-2">
                      {productDistribution.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <span
                              className={`w-3 h-3 rounded-full ${item.color} mr-2`}
                            ></span>
                            <span className="text-gray-300 text-sm">
                              {item.label}
                            </span>
                          </div>
                          <span className="font-semibold text-gray-200">
                            {item.value}%
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Regional Sales */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-md">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                  <h3 className="font-bold text-gray-100">מכירות לפי אזור</h3>
                  <div className="bg-gray-700 p-1 rounded-lg">
                    <PieChart size={20} className="text-gray-300" />
                  </div>
                </div>
                <div className="p-4 flex">
                  <div className="w-1/2 relative flex items-center justify-center">
                    {/* דיאגרמת עוגה נוספת */}
                    <div className="w-40 h-40 rounded-full overflow-hidden relative">
                      <div
                        className="absolute inset-0"
                        style={{
                          clipPath:
                            "polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 0)",
                          backgroundColor: "#3b82f6",
                          transform: "rotate(0deg)",
                        }}
                      ></div>
                      <div
                        className="absolute inset-0"
                        style={{
                          clipPath:
                            "polygon(50% 50%, 100% 0, 100% 100%, 0 100%)",
                          backgroundColor: "#6366f1",
                          transform: "rotate(137deg)",
                        }}
                      ></div>
                      <div
                        className="absolute inset-0"
                        style={{
                          clipPath: "polygon(50% 50%, 0 0, 100% 0)",
                          backgroundColor: "#ec4899",
                          transform: "rotate(288deg)",
                        }}
                      ></div>
                      <div
                        className="absolute inset-0"
                        style={{
                          clipPath: "polygon(50% 50%, 0 0, 70% 0)",
                          backgroundColor: "#ef4444",
                          transform: "rotate(331deg)",
                        }}
                      ></div>
                      <div className="absolute inset-3 bg-gray-800 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-200">
                          100%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-1/2">
                    <ul className="space-y-2">
                      {regionalSales.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <span
                              className={`w-3 h-3 rounded-full ${item.color} mr-2`}
                            ></span>
                            <span className="text-gray-300 text-sm">
                              {item.label}
                            </span>
                          </div>
                          <span className="font-semibold text-gray-200">
                            {item.value}%
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Advisor Wizard Modal */}
      {wizardOpen && (
        <div className="fixed inset-0 z-50" dir="rtl">
          {/* Modal backdrop */}
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>

          {/* Modal container - solid background with proper opacity */}
          <div className="flex items-center justify-center h-full p-4">
            <div className="w-full max-w-md p-6 rounded-lg shadow-xl bg-gray-800 border-2 border-cyan-400 relative">
              {!wizardCompleted ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-cyan-100">
                      יצירת {getAdvisorName(selectedWizardType)}
                    </h2>
                    <div className="bg-cyan-800 text-cyan-100 px-2 py-1 rounded-lg text-sm">
                      שלב {wizardStep}/3
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-100 mb-2">
                      {getWizardQuestion()}
                    </h3>
                    <div className="p-4">
                      {wizardStep === 1 && (
                        <div>
                          <h3 className="text-xl mb-4">שאלה 1</h3>
                          <textarea
                            value={wizardAnswers.question1}
                            onChange={(e) =>
                              updateWizardAnswer("question1", e.target.value)
                            }
                            className="w-full p-3 border rounded-lg bg-gray-700 bg-opacity-70 text-white"
                            rows={4}
                          ></textarea>
                        </div>
                      )}
                      {wizardStep === 2 && (
                        <div>
                          <h3 className="text-xl mb-4">שאלה 2</h3>
                          <textarea
                            value={wizardAnswers.question2}
                            onChange={(e) =>
                              updateWizardAnswer("question2", e.target.value)
                            }
                            className="w-full p-3 border rounded-lg bg-gray-700 bg-opacity-70 text-white"
                            rows={4}
                          ></textarea>
                        </div>
                      )}
                      {wizardStep === 3 && (
                        <div>
                          <h3 className="text-xl mb-4">שאלה 3</h3>
                          <textarea
                            value={wizardAnswers.question3}
                            onChange={(e) =>
                              updateWizardAnswer("question3", e.target.value)
                            }
                            className="w-full p-3 border rounded-lg bg-gray-700 bg-opacity-70 text-white"
                            rows={4}
                          ></textarea>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={closeWizard}
                      className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 border border-gray-600"
                    >
                      ביטול
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 flex items-center shadow-md"
                      disabled={!wizardAnswers[`question${wizardStep}`]}
                    >
                      {wizardStep === 3 ? "סיום" : "הבא"}
                      {wizardStep !== 3 && (
                        <ChevronRight size={18} className="mr-1" />
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-cyan-700 rounded-full flex items-center justify-center text-white mx-auto mb-6">
                      <Briefcase size={40} />
                    </div>
                    <h2 className="text-xl font-bold text-cyan-100 mb-4">
                      תודה רבה!
                    </h2>
                    <p className="text-gray-300 mb-6">
                      יצירת {getAdvisorName(selectedWizardType)} בתהליך. המסמך
                      יישלח בהקדם.
                    </p>
                    <button
                      onClick={closeWizard}
                      className="px-6 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 shadow-md"
                    >
                      סגור
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Agent Modal */}
      {isAgentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">
              הוספת סוכן חדש
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  שם
                </label>
                <input
                  type="text"
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 placeholder-gray-500 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  תפקיד
                </label>
                <input
                  type="text"
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 placeholder-gray-500 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  פרומפט
                </label>
                <textarea className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 placeholder-gray-500 focus:ring-cyan-500 focus:border-cyan-500 h-24" />
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-2">
              <button
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 border border-gray-600"
                onClick={() => setIsAgentModalOpen(false)}
              >
                ביטול
              </button>
              <button
                className="px-4 py-2 bg-cyan-600 text-gray-100 rounded-md hover:bg-cyan-700"
                onClick={() => setIsAgentModalOpen(false)}
              >
                הוסף סוכן
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
