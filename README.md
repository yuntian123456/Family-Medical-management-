# 家庭健康管理系统

一个基于现代Web技术栈开发的家庭健康管理系统，用于管理家庭成员的健康信息、医疗记录、处方和健康指标。本项目支持 Docker 快速部署。

## 主要技术栈

- **前端**: React, TypeScript, Ant Design
- **后端**: Node.js, Express.js, TypeScript, Prisma ORM (SQLite)
- **容器化**: Docker, Docker Compose

## 核心功能

- 用户注册与登录
- 家庭成员信息管理
- 医疗记录管理
- 处方信息管理
- 健康指标跟踪

## 项目设置与运行

### 后端 (Backend)

1.  **导航到后端目录**:
    ```bash
    cd backend
    ```
2.  **安装依赖**:
    ```bash
    npm install
    ```
3.  **设置环境变量**:
    复制 `.env.example` (如果不存在，则创建一个新的 `.env` 文件) 到 `.env`。
    ```bash
    cp .env.example .env 
    ```
    或者手动创建 `.env` 文件并至少包含以下内容 (基于 `backend/src/auth.ts` 和 `backend/prisma/schema.prisma` 的推断):
    ```env
    DATABASE_URL="file:./dev.db"
    JWT_SECRET="your-super-secret-and-long-jwt-key" 
    # PORT=3001 (可选, 默认为 3001)
    ```
    *注意: `JWT_SECRET` 应该是一个强大且唯一的密钥。*
4.  **数据库迁移**:
    Prisma 需要初始化数据库并应用迁移。
    ```bash
    npx prisma migrate dev
    npx prisma generate
    ```
5.  **启动开发服务器**:
    ```bash
    npm run dev 
    ```
    (假设 `package.json` 中有 `dev` 脚本，通常是 `ts-node-dev src/index.ts` 或类似命令。如果 `dev` 脚本不存在，可以使用 `npm start` 或 `node dist/index.js` 在编译后运行，或者直接 `ts-node src/index.ts` 如果 `ts-node` 是全局或项目依赖。)
    后端服务默认运行在 `http://localhost:3001`。

### 前端 (Frontend)

1.  **导航到前端目录**:
    ```bash
    cd frontend
    ```
2.  **安装依赖**:
    ```bash
    npm install
    ```
3.  **启动开发服务器**:
    ```bash
    npm start
    ```
    前端应用默认运行在 `http://localhost:3000`，并将自动在浏览器中打开。

## Docker 部署

本项目支持使用 Docker Compose 进行快速部署。

1.  **构建并启动容器**:
    在项目根目录下运行：
    ```bash
    docker-compose up --build -d
    ```
2.  **访问应用**:
    *   前端应用: `http://localhost:3000`
    *   后端服务: `http://localhost:3001`

3.  **停止容器**:
    ```bash
    docker-compose down
    ```

## 功能使用指南

### 1. 用户注册与登录

-   **注册**:
    -   访问前端应用的注册页面 (通常是 `/register`)。
    -   输入有效的邮箱地址和密码。确认密码需要与密码一致。
    -   点击“注册”按钮。成功后，系统会提示注册成功，并引导用户前往登录页面。
-   **登录**:
    -   访问前端应用的登录页面 (通常是 `/login`)。
    -   输入注册时使用的邮箱和密码。
    -   点击“登录”按钮。成功后，用户将被重定向到个人健康管理仪表盘 (`/dashboard`)。

### 2. 个人健康管理仪表盘 (Dashboard)

-   登录后，用户会看到仪表盘主页。
-   这里是管理所有家庭成员健康信息的中心入口。
-   主要功能模块（如家庭成员管理、医疗记录等）可以从仪表盘页面或导航栏访问（具体视前端实现而定）。

### 3. 家庭成员管理

-   **添加家庭成员**:
    -   在仪表盘中找到“添加家庭成员”或类似功能的按钮/链接。
    -   输入家庭成员的姓名、关系 (如：自己、配偶、子女)、出生日期等信息。
    -   保存后，新的家庭成员将显示在列表中。
-   **查看/编辑/删除家庭成员**:
    -   可以查看已添加的家庭成员列表。
    -   应提供编辑现有成员信息或删除不需要的成员的选项。

### 4. 医疗记录管理

-   此功能针对特定的家庭成员。
-   **添加医疗记录**:
    -   选择一个家庭成员，进入其详情页或医疗记录管理区。
    -   点击“添加医疗记录”。
    -   输入记录类型 (如：就诊、化验、疫苗接种)、描述、日期和可选的附件信息。
    -   保存记录。
-   **查看/编辑/删除医疗记录**:
    -   可以查看指定家庭成员的所有医疗记录。
    -   应提供编辑或删除记录的功能。

### 5. 处方信息管理

-   此功能也与特定家庭成员关联。
-   **添加处方**:
    -   选择家庭成员，进入其处方管理区。
    -   点击“添加处方”。
    -   输入药物名称、剂量、服用频率、开始日期、可选的结束日期和备注。
    -   保存处方信息。
-   **查看/编辑/删除处方**:
    -   可以查看指定家庭成员的所有处方。
    -   应提供编辑或删除处方的功能。

### 6. 健康指标跟踪

-   用于记录和监控家庭成员的健康指标。
-   **添加健康指标记录**:
    -   选择家庭成员，进入其健康指标管理区。
    -   点击“添加健康指标”。
    -   输入指标类型 (如：体重、血压、血糖)、测量值、单位 (如：kg, mmHg, mg/dL)、测量日期和可选备注。
    -   保存记录。
-   **查看/编辑/删除健康指标**:
    -   可以查看指定家庭成员的健康指标历史记录，可能包含图表展示（视前端实现）。
    -   应提供编辑或删除指标记录的功能。

## API 端点概览

所有API端点均以 `/api` 为前缀。

###认证 (Auth)

-   `POST /auth/register`: 用户注册。
-   `POST /auth/login`: 用户登录。

### 家庭成员 (Family Members)

-   `POST /family-members`: (需认证) 添加新的家庭成员。
-   `GET /family-members`: (需认证) 获取当前用户的所有家庭成员。
-   `GET /family-members/:memberId`: (需认证) 获取特定家庭成员的详细信息。
-   `PUT /family-members/:memberId`: (需认证) 更新特定家庭成员的信息。
-   `DELETE /family-members/:memberId`: (需认证) 删除特定的家庭成员。

### 医疗记录 (Medical Records)

-   `POST /family-members/:familyMemberId/medical-records`: (需认证) 为指定家庭成员添加医疗记录。
-   `GET /family-members/:familyMemberId/medical-records`: (需认证) 获取指定家庭成员的所有医疗记录。
-   `GET /family-members/:familyMemberId/medical-records/:recordId`: (需认证) 获取特定的医疗记录。
-   `PUT /family-members/:familyMemberId/medical-records/:recordId`: (需认证) 更新特定的医疗记录。
-   `DELETE /family-members/:familyMemberId/medical-records/:recordId`: (需认证) 删除特定的医疗记录。

### 处方 (Prescriptions)

-   `POST /family-members/:familyMemberId/prescriptions`: (需认证) 为指定家庭成员添加处方。
-   `GET /family-members/:familyMemberId/prescriptions`: (需认证) 获取指定家庭成员的所有处方。
-   `GET /family-members/:familyMemberId/prescriptions/:prescriptionId`: (需认证) 获取特定的处方。
-   `PUT /family-members/:familyMemberId/prescriptions/:prescriptionId`: (需认证) 更新特定的处方。
-   `DELETE /family-members/:familyMemberId/prescriptions/:prescriptionId`: (需认证) 删除特定的处方。

### 健康指标 (Health Indicators)

-   `POST /family-members/:familyMemberId/health-indicators`: (需认证) 为指定家庭成员添加健康指标记录。
-   `GET /family-members/:familyMemberId/health-indicators`: (需认证) 获取指定家庭成员的所有健康指标记录。
-   `GET /family-members/:familyMemberId/health-indicators/:indicatorId`: (需认证) 获取特定的健康指标记录。
-   `PUT /family-members/:familyMemberId/health-indicators/:indicatorId`: (需认证) 更新特定的健康指标记录。
-   `DELETE /family-members/:familyMemberId/health-indicators/:indicatorId`: (需认证) 删除特定的健康指标记录。

### 健康检查 (Health Check)

-   `GET /health`: 服务器健康检查。
