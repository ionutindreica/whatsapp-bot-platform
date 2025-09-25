# 🔐 SuperAdmin Guide - ChatFlow AI

## 📋 **Overview**
SuperAdmin este contul cu acces complet la toate funcționalitățile platformei, incluzând:
- Management complet al utilizatorilor
- Supervizare a tuturor activităților
- Configurare sistem
- Acces la toate datele și statistici

## 🚀 **Setup SuperAdmin**

### **1. Creează contul SuperAdmin**
```bash
cd backend
npm run create-superadmin
```

### **2. Credențiale default**
- **Email**: `johnindreica@gmail.com`
- **Password**: `SuperAdmin123!`
- **Role**: `SUPER_ADMIN`

### **3. Accesează Dashboard-ul**
- **Frontend**: `http://localhost:8080/superadmin`
- **Backend API**: `http://localhost:3001/api/admin/dashboard`

## 🛡️ **Funcționalități SuperAdmin**

### **1. User Management**
- **Vizualizare toți utilizatorii** cu filtrare și căutare
- **Editare profiluri** utilizatori
- **Suspendare/Activare** conturi
- **Ștergere** conturi (cu protecție pentru SuperAdmin)
- **Schimbare roluri** (USER, ADMIN, SUPER_ADMIN)
- **Vizualizare detalii** complete despre fiecare utilizator

### **2. System Analytics**
- **Statistici generale**: utilizatori, venituri, bot-uri, mesaje
- **Grafice de creștere** utilizatori și venituri
- **Analiză performanță** sistem
- **Monitorizare** în timp real

### **3. System Configuration**
- **Email Settings**: SMTP, porturi, configurare
- **Payment Settings**: Stripe keys, webhook-uri
- **System Limits**: max utilizatori, bot-uri, mesaje
- **Security Settings**: autentificare, verificare email
- **Maintenance Mode**: activare/dezactivare

### **4. Activity Logs**
- **Log complet** al tuturor acțiunilor admin
- **Tracking IP** și user agent
- **Filtrare** după acțiune, admin, perioadă
- **Export** logs pentru audit

## 🔧 **API Endpoints SuperAdmin**

### **Dashboard & Stats**
```bash
GET /api/admin/dashboard
# Returnează statistici complete și activitate recentă
```

### **User Management**
```bash
GET /api/admin/users?page=1&limit=20&search=john&role=USER&status=ACTIVE
# Lista utilizatori cu filtrare și paginare

GET /api/admin/users/:userId
# Detalii complete despre un utilizator

PUT /api/admin/users/:userId
# Actualizare utilizator (nume, email, rol, status)

POST /api/admin/users/:userId/suspend
# Suspendare utilizator cu motiv

POST /api/admin/users/:userId/activate
# Activare utilizator

DELETE /api/admin/users/:userId
# Ștergere utilizator (cu protecție SuperAdmin)
```

### **System Settings**
```bash
GET /api/admin/settings
# Obține toate setările sistem

PUT /api/admin/settings
# Actualizează setările sistem
```

### **Activity Logs**
```bash
GET /api/admin/logs?page=1&limit=50&action=USER_SUSPENDED&adminId=123
# Log-uri cu filtrare și paginare
```

## 🛡️ **Securitate SuperAdmin**

### **Protecții Implementate**
- **JWT Authentication** obligatoriu
- **Role-based access** (doar SUPER_ADMIN)
- **IP tracking** pentru toate acțiunile
- **Audit log** complet
- **Protecție ștergere** SuperAdmin

### **Best Practices**
1. **Schimbă parola** imediat după creare
2. **Folosește email** securizat
3. **Activează 2FA** dacă este posibil
4. **Monitorizează** log-urile regulat
5. **Backup** setările importante

## 📊 **Dashboard Features**

### **Stats Overview**
- **Total Users**: numărul total de utilizatori
- **Active Users**: utilizatori activi
- **Total Revenue**: venituri totale
- **Monthly Revenue**: venituri lunare
- **Total Bots**: numărul total de bot-uri
- **Messages Sent**: mesaje trimise

### **User Management Interface**
- **Search & Filter**: căutare și filtrare avansată
- **Bulk Actions**: acțiuni în masă
- **User Details**: vizualizare detaliată
- **Quick Actions**: suspendare, activare, editare

### **System Configuration**
- **Email Settings**: configurare SMTP
- **Payment Settings**: configurare Stripe
- **System Limits**: limite sistem
- **Security Settings**: setări securitate

## 🚨 **Troubleshooting**

### **SuperAdmin nu poate accesa dashboard**
```bash
# Verifică dacă contul există
npm run create-superadmin

# Verifică log-urile backend
tail -f backend/logs/app.log
```

### **Eroare de permisiuni**
```bash
# Verifică rolul utilizatorului
# Trebuie să fie SUPER_ADMIN

# Verifică JWT token
# Token-ul trebuie să fie valid
```

### **Database connection issues**
```bash
# Verifică conexiunea la database
npm run db:studio

# Verifică schema
npm run db:push
```

## 📝 **Log-uri și Monitorizare**

### **Tipuri de acțiuni loggate**
- `USER_CREATED` - utilizator creat
- `USER_UPDATED` - utilizator actualizat
- `USER_DELETED` - utilizator șters
- `USER_SUSPENDED` - utilizator suspendat
- `USER_ACTIVATED` - utilizator activat
- `SUBSCRIPTION_CHANGED` - abonament schimbat
- `PAYMENT_PROCESSED` - plată procesată
- `SYSTEM_CONFIGURED` - sistem configurat

### **Informații loggate**
- **Admin ID**: cine a făcut acțiunea
- **Target User ID**: asupra cui s-a făcut acțiunea
- **Action**: tipul acțiunii
- **Description**: descrierea acțiunii
- **Metadata**: informații suplimentare
- **IP Address**: adresa IP
- **User Agent**: browser și sistem
- **Timestamp**: data și ora

## 🔄 **Workflow SuperAdmin**

### **1. Monitorizare zilnică**
- Verifică statistici generale
- Monitorizează utilizatori noi
- Verifică erori și probleme

### **2. Management utilizatori**
- Răspunde la cereri de suspenare
- Verifică conturi suspecte
- Gestionare abonamente

### **3. Configurare sistem**
- Actualizează setări
- Monitorizează performanță
- Backup configurații

### **4. Audit și securitate**
- Verifică log-urile
- Monitorizează accesuri
- Verifică securitatea

---

**SuperAdmin Dashboard**: `http://localhost:8080/superadmin`
**Backend API**: `http://localhost:3001/api/admin`
**Database Studio**: `npm run db:studio`
