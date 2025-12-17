<div dir="rtl" markdown="1">

# Clock Logistics Client

ממשק ניהול לוגיסטי המבוסס על Vue 3 + Vite. המערכת מציגה דוחות מלאי, סיכונים קדימה ופעולות מהירות (<span dir="ltr">Purchase Order / Override / Inventory</span>) ומדמה תרחישי רכש וניהול מלאי.

## מה המערכת עושה היום
- **דשבורד יומי**: <span dir="ltr">Risk60d</span>, פריטים קריטיים ו-<span dir="ltr">Dead Stock</span>, עם הסברים עסקיים ופתיחת מגירת פעולות לכל פריט.
- **המלצות הזמנה (Reorder)**: טבלת המלצות עם סינון "הצג רק פריטים עם המלצת הזמנה חיובית", ימים עד <span dir="ltr">ROP</span>, <span dir="ltr">Pack size</span> / מינימום הזמנה, תאריך הגעה מוצע לפי <span dir="ltr">lead time</span> ופעולות מתוך השורה.
- **ניהול הזמנות רכש**: צפייה ברשימת <span dir="ltr">Purchase Orders</span> קיימות וסטטוסים.
- **מגירת פעולות פריט**: שלושה טפסים (<span dir="ltr">Purchase Order</span>, <span dir="ltr">Override</span>, <span dir="ltr">Inventory</span>) עם ערכי ברירת מחדל לפי ההקשר, ניווט בטאבים וקיצור <span dir="ltr">Esc</span> לסגירה.
- **אינטגרציית נתונים**: שכבת <span dir="ltr">API</span> מרוכזת + <span dir="ltr">TanStack Query</span> לניהול <span dir="ltr">cache/loading/error</span>, ולידציית <span dir="ltr">JSON</span> באמצעות <span dir="ltr">Zod</span>.

## ארכיטקטורה וניווט
- **Router**: מסכי עבודה עיקריים: `/dashboard`, `/reorder`, `/purchase-orders` (קיים redirect מ-`/` למסך ברירת מחדל).
- **מבנה תיקיות**: המודול הלוגיסטי תחת `src/logistics` מחולק ל-`features`, `queries`, `mutations`, `domain`, `api`. רכיבי <span dir="ltr">UI</span> כלליים תחת `src/shared`.

## טכנולוגיה והפעלה
- **סטאק**: Vue 3 + TypeScript, Vite, Pinia, `@tanstack/vue-query`, Zod.

### התקנה והרצה
```sh
npm install
npm run dev    # הרצה לפיתוח (hot reload)
npm run build  # Build לפרודקשן (כולל type-check דרך vue-tsc)
```

## מה צפוי להתווסף בהמשך

מבוסס על סיפורי המשתמש המלאים שהוגדרו:

- **מנהל מכירות**: הצעות מלאי ממוקדות לבעלי חנויות עם מגבלת תקציב (עד 15% מתקציב החנות), טיפול בחנויות חדשות דרך רשימת "הנמכרים ביותר", וסינון כפילויות כדי לא להציע פריטים שנקנו ב-30 הימים האחרונים.
- **מנהל שיווק**: דו"ח שבועי לזיהוי פער מותג (פער העולה על 30% ביחס לממוצע אזורי) עם נימוקים דמוגרפיים אוטומטיים ואפשרות לייצוא פרטי קשר לניהול קמפיינים.
- **מנהל לוגיסטיקה**: חיזוי חוסרי מלאי חכם עם מקדם עונתיות והתחשבות ב-<span dir="ltr">lead time</span>, התרעות על מלאי מת (ירידה של 40–60% בקצב מכירה), ורשימת מוצרים בסיכון.
- **בעל חנות**: אזור אישי להצגת הצעת מלאי, אישור או דחייה ועריכת כמויות; חישוב סל דינמי בזמן אמת, איסוף סיבת דחייה מחייבת, ובדיקת מסגרת אשראי שחוסמת אישור חריג.

</div>
