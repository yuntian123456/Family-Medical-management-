# 家庭健康管理系统 (Family Health Management System)

一个基于现代Web技术栈开发的家庭健康管理系统，用于管理家庭成员的健康信息、医疗记录、处方和健康指标。本项目支持本地开发和 Docker 快速部署。

## 主要技术栈 (Core Technologies)

-   **前端 (Frontend)**: React, TypeScript, Ant Design
-   **后端 (Backend)**: Node.js, Express.js, TypeScript, Prisma ORM (使用 SQLite 数据库)
-   **容器化 (Containerization)**: Docker, Docker Compose

## 核心功能 (Core Functionalities)

-   用户注册与登录 (User Registration & Login)
-   家庭成员信息管理 (Family Member Information Management)
-   医疗记录管理 (Medical Record Management)
-   处方信息管理 (Prescription Information Management)
-   健康指标跟踪 (Health Indicator Tracking)

## 本地开发环境配置 (Local Development Setup)

在本地运行此项目需要分别配置和启动后端与前端服务。

### 后端服务 (Backend Service)

1.  **先决条件 (Prerequisites):**
    *   Node.js (推荐 LTS 版本，例如 v18.x 或 v20.x)
    *   npm (通常随 Node.js 一同安装)

2.  **导航到后端目录 (Navigate to Backend Directory):**
    ```bash
    cd backend
    ```

3.  **配置环境变量 (Configure Environment Variables):**
    在 `backend` 目录下创建一个名为 `.env` 的文件。此文件用于存放数据库连接信息和 JWT 密钥。
    复制以下内容到 `backend/.env` 文件中：
    ```env
    # backend/.env
    DATABASE_URL="file:./prisma/dev.db"
    JWT_SECRET="your_randomly_generated_strong_secret_for_local_dev" 
    # PORT=3001 # 可选，如果需要指定不同于默认3001的端口
    ```
    -   `DATABASE_URL`: 指定 Prisma 使用 SQLite 数据库，文件将位于 `backend/prisma/dev.db`。
    -   `JWT_SECRET`: **必须**将其替换为一个强大且唯一的随机字符串。您可以使用密码生成器或以下命令 (在 Linux/macOS 系统中) 生成一个示例密钥：
        ```bash
        openssl rand -hex 32
        ```
    **重要:** `backend/.gitignore` 文件已配置为忽略 `.env` 文件，防止敏感信息泄露。

4.  **安装依赖 (Install Dependencies):**
    在 `backend` 目录下运行：
    ```bash
    npm install
    ```

5.  **数据库迁移 (Database Migration):**
    首次设置或数据库 schema 变更后，需要运行 Prisma migrate 来创建或更新数据库结构。
    ```bash
    npx prisma migrate dev --name init 
    ```
    (如果 `init` 迁移已存在，您可以为后续迁移选择一个描述性的名称，例如 `--name added_new_feature`。)

6.  **启动后端服务 (Start Backend Service):**
    ```bash
    npm run dev
    ```
    服务默认将在 `http://localhost:3001` 上启动。您可以通过修改 `.env` 文件中的 `PORT` 变量来更改端口。

### 前端服务 (Frontend Service)

1.  **先决条件 (Prerequisites):**
    *   Node.js (推荐 LTS 版本，例如 v18.x 或 v20.x)
    *   npm (通常随 Node.js 一同安装)

2.  **导航到前端目录 (Navigate to Frontend Directory):**
    从项目根目录，运行：
    ```bash
    cd frontend
    ```

3.  **安装依赖 (Install Dependencies):**
    在 `frontend` 目录下运行：
    ```bash
    npm install
    ```

4.  **启动前端服务 (Start Frontend Service):**
    ```bash
    npm start
    ```
    服务默认将在 `http://localhost:3000` 上启动，并通常会自动在浏览器中打开。

5.  **API 连接 (API Connection):**
    前端应用通过 `frontend/src/services/api.ts` 中的 Axios 实例与后端 API 通信。该实例默认配置为向 `/api` 发出请求。
    -   在本地开发中，当后端服务运行于 `http://localhost:3001` 时，Create React App 的开发服务器会将这些 `/api` 请求代理到 `http://localhost:3001/api` (通过 `frontend/package.json` 中的 `"proxy": "http://localhost:3001"` 配置实现)。请确保此代理设置存在且正确。
    -   如果代理未设置或不工作，您可能需要直接在 `api.ts` 中配置 `baseURL` 为 `http://localhost:3001/api`。

    **确保后端服务已启动并正在运行**，以便前端能够成功连接和获取数据。

## Docker 部署 (Docker Deployment)

本项目支持使用 Docker Compose 进行快速部署，实现一键启动前端和后端服务。

### 先决条件 (Prerequisites)

-   Docker Desktop (适用于 Windows, macOS) 或 Docker Engine 和 Docker Compose (适用于 Linux) 已安装。
-   Git (用于克隆项目)。

### 部署步骤 (Deployment Steps)

1.  **克隆项目 (Clone the Repository):**
    ```bash
    git clone <repository_url>
    cd <project_directory_name>
    ```
    将 `<repository_url>` 和 `<project_directory_name>` 替换为实际的 URL 和目录名。

2.  **配置环境变量 (Configure Environment Variables for Docker):**
    在项目的根目录下 (与 `docker-compose.yml` 文件同级)，创建一个名为 `.env` 的文件。此文件用于为 Docker Compose 提供环境变量，特别是 `JWT_SECRET`。
    复制以下内容到项目根目录的 `.env` 文件中：

    ```env
    # .env (project root directory)
    JWT_SECRET="your_very_strong_and_unique_secret_here_for_docker"
    # PORT=3001 # 后端服务端口，已在 docker-compose.yml 中配置并传递给容器
    ```
    -   将 `your_very_strong_and_unique_secret_here_for_docker` 替换为一个强大且唯一的随机字符串 (参见 "安全配置" 部分的 `JWT_SECRET` 生成方法)。
    **重要:** 确保此根目录的 `.env` 文件也被添加到项目的 `.gitignore` 文件中。

3.  **构建并启动服务 (Build and Start Services):**
    在项目根目录下，运行以下命令：
    ```bash
    docker-compose up -d --build
    ```
    -   `--build`: 强制 Docker Compose 在启动前重新构建镜像。首次运行时或 Dockerfile/代码更改后建议使用。
    -   `-d`: 以分离模式 (detached mode) 运行容器，即在后台运行。

4.  **数据库初始化与迁移 (Database Initialization & Migration):**
    -   后端服务 (`backend`) 的 Dockerfile 配置为在启动时自动运行 Prisma 数据库迁移 (`npx prisma migrate deploy`)。这将根据 `prisma/migrations` 目录中的迁移文件更新或创建数据库结构。
    -   对于 SQLite，数据库文件 (`dev.db` 及其相关文件如 `-journal`) 将通过 Docker Volume 映射持久化到您宿主机的 `./backend/prisma/` 目录下。
    -   如果首次运行或迁移状态有问题，您可以手动检查。要手动运行迁移（在容器已启动后）：
        ```bash
        docker-compose exec backend npx prisma migrate deploy
        ```

5.  **访问应用 (Accessing the Application):**
    -   **前端 (Frontend):** 打开浏览器并访问 `http://localhost:3000`。
    -   **后端 API (Backend API):** 前端的 Nginx 配置已将 `/api` 请求代理到后端服务。您也可以直接通过 `http://localhost:3001` (例如, `http://localhost:3001/api/health` 进行健康检查) 测试后端。

### 服务说明 (Services Overview)

-   **`backend`**:
    -   构建自 `./backend/Dockerfile`。
    -   在容器内部运行于端口 `3001`。
    -   映射到宿主机的端口 `3001`。
    -   数据库 (`dev.db`) 持久化在宿主机的 `./backend/prisma/` 目录。
    -   `JWT_SECRET` 和 `DATABASE_URL` 环境变量在 `docker-compose.yml` 中配置 (`JWT_SECRET` 从根 `.env` 文件读取)。
-   **`frontend`**:
    -   构建自 `./frontend/Dockerfile`。
    -   Nginx 服务在容器内部运行于端口 `80`。
    -   映射到宿主机的端口 `3000`。
    -   依赖于 `backend` 服务。
    -   Nginx 配置 (`frontend/nginx.conf`) 用于提供 React 应用的静态文件，并将 `/api/*` 请求代理到 `backend` 服务。

### 停止服务 (Stopping Services)

要停止正在运行的服务：
```bash
docker-compose down
```
此命令会停止并删除容器。由于 `./backend/prisma` 是宿主机绑定卷，SQLite 数据库文件会保留在您的文件系统上。

## 安全配置 (Security Configuration)

### JWT_SECRET 环境变量

`JWT_SECRET` 是用于签名和验证 JSON Web Tokens (JWT) 的密钥。JWT 用于用户身份验证和会话管理。一个强大且保密的 `JWT_SECRET` 对于保障应用程序的安全性至关重要。

**重要性:**
-   **防止未授权访问:** 如果 `JWT_SECRET` 泄露或不够强大，攻击者可能会伪造有效的 JWT，从而获得对系统的未授权访问。
-   **会话安全:** 一个安全的密钥确保用户会话信息不被篡改。

**配置说明:**

为了应用的安全性，您**必须**设置一个强大且唯一的 `JWT_SECRET` 环境变量。

**推荐做法:**
生成一个足够长且随机的字符串作为您的 `JWT_SECRET`。您可以使用密码生成器或以下命令 (在 Linux/macOS 系统中) 生成一个示例密钥：
```bash
openssl rand -hex 32
```
这将生成一个 32 字节 (64 个十六进制字符) 的随机字符串。

**设置方法:**

1.  **Docker Compose 环境:**
    如 "Docker 部署" 部分所述，在项目根目录创建 `.env` 文件并填入 `JWT_SECRET`。`docker-compose.yml` 文件配置为从该文件加载此变量供后端服务使用。这是 Docker 化部署的推荐方式。

2.  **本地开发环境 (不使用 Docker):**
    如 "本地开发环境配置" -> "后端服务" 部分所述，在 `backend` 目录下创建 `backend/.env` 文件，并在其中设置 `JWT_SECRET`。

**生产环境中的后端行为:**
-   如果应用程序在生产模式下运行 (`NODE_ENV=production`)：
    -   且 `JWT_SECRET` 环境变量**未设置**，后端应用程序将记录一个严重错误并**退出**。
    -   且 `JWT_SECRET` 环境变量被设置为默认的 `'your-secret-key'` (不应在生产中使用)，后端应用程序将记录一个严重错误并**退出**。
-   这是为了防止在生产环境中使用不安全的默认密钥运行。

**开发环境中的后端行为:**
-   如果 `JWT_SECRET` 未设置或设置为默认值 `'your-secret-key'`，后端应用程序将在控制台输出警告信息，提示您设置一个安全的密钥，但应用仍会运行以便于开发。强烈建议即使在开发中也使用自定义的 `JWT_SECRET`。

请务必妥善保管您的 `JWT_SECRET`，不要将其硬编码到代码库中或公开分享。

## 后端说明 (Backend Notes)

### 输入验证 (Input Validation)

**重要性:**
对所有来自客户端的输入数据进行严格的后端验证是保障应用程序安全和数据完整性的关键措施。仅依赖前端验证是不够的，因为恶意用户可以绕过前端直接向API发送请求。

**当前状态:**
-   系统目前对部分路由（如用户注册 `POST /api/auth/register`）实现了基本的输入验证，包括：
    -   必填字段检查 (例如，邮箱和密码)。
    -   数据格式验证 (例如，邮箱格式，通过正则表达式 `^[^\s@]+@[^\s@]+\.[^\s@]+$` 进行校验)。
    -   数据约束验证 (例如，密码最小长度为8个字符)。
-   当验证失败时，API会返回相应的 `400 Bad Request` 错误，并在JSON响应中提供具体的错误信息。例如，对于注册请求，如果邮箱格式无效，会返回 `{"error": "Invalid email format"}`；如果密码过短，会返回 `{"error": "Password must be at least 8 characters long"}`。
-   对于业务逻辑错误，如尝试使用已存在的邮箱注册，API会返回 `409 Conflict` 错误，例如 `{"error": "Email already in use"}`。

**未来方向与建议:**
虽然已开始引入输入验证，但为了进一步增强系统的健壮性和安全性，我们计划逐步在所有API端点推广更全面的输入验证策略。这包括但不限于：
-   字符串字段的最小/最大长度限制。
-   数字字段的类型和范围校验。
-   日期字段的有效性校验。
-   枚举类型字段的合法值校验。

对于更复杂或模型驱动的验证场景，推荐在未来的开发中使用专门的验证库，例如 [Zod](https://zod.dev/) 或 [Joi](https://joi.dev/)。这些库能以声明式的方式定义数据结构及其验证规则，使验证逻辑更清晰、更易于维护。

**使用 Zod 的示例 (未来可能采用):**
```typescript
// 示例: 使用 Zod 定义用户注册的输入结构
import { z } from 'zod';

const UserRegistrationSchema = z.object({
  email: z.string().email({ message: "无效的邮箱地址" }),
  password: z.string().min(8, { message: "密码至少需要8个字符" }),
  // ... 其他字段和规则
});

// 在路由处理函数中可以这样使用:
// try {
//   const validatedData = UserRegistrationSchema.parse(req.body);
//   // ... 处理验证通过的数据
// } catch (error) {
//   // Zod 会抛出包含详细错误信息的异常
//   return res.status(400).json({ errors: error.errors });
// }
```
采用此类库将有助于系统化地处理输入验证，减少潜在错误，并提高开发效率。

### 错误处理 (Error Handling)

**概述:**
为了提高代码的健壮性和可维护性，项目引入了中央化的错误处理机制。此机制旨在统一处理应用程序中发生的各种错误，减少重复的 `try...catch` 逻辑，并确保向客户端返回一致的错误响应格式。

**实现方式:**
1.  **中央错误处理中间件 (`backend/src/middleware/errorHandlerMiddleware.ts`):**
    -   一个 Express 中间件，在所有路由和业务逻辑之后注册。
    -   它负责捕获从路由处理函数、服务层或数据库操作中通过 `next(error)` 传递过来的错误。
    -   中间件会记录错误详情（名称、消息、堆栈跟踪、状态码）以供调试。
    -   根据错误类型生成标准化的JSON错误响应：
        -   **Prisma 错误:**
            -   `Prisma.PrismaClientKnownRequestError`:
                -   `P2002` (唯一约束冲突): 返回 `409 Conflict`，例如：`{"error": "A record with this value already exists. Fields: [field_name]"}`。
                -   `P2025` (记录未找到): 返回 `404 Not Found`，例如：`{"error": "The requested record was not found."}`。
                -   其他 Prisma 已知请求错误默认返回 `500 Internal Server Error`，并提示为数据库相关错误。
            -   `Prisma.PrismaClientValidationError`: 返回 `400 Bad Request`，提示输入数据校验失败，例如：`{"error": "Invalid input data. Please check your request."}`。
        -   **JWT 错误:**
            -   `TokenExpiredError`: 返回 `401 Unauthorized`，错误信息为 `{"error": "Unauthorized: Token expired"}`。
            -   `JsonWebTokenError` (其他JWT问题，如格式错误): 返回 `403 Forbidden`，错误信息为 `{"error": "Forbidden: Invalid token"}`。
        -   **自定义 HTTP 错误:** 如果错误对象包含 `statusCode` 属性 (通常为自定义错误或由某些库抛出的错误)，则使用该状态码。如果错误对象还包含 `expose: true` 属性，则错误消息将直接发送给客户端；否则，将发送通用错误消息。
        -   **其他/未知错误:**
            -   在生产环境 (`NODE_ENV=production`)，对于未明确指定 `statusCode` 或 `statusCode >= 500` 的错误，返回通用的 `500 Internal Server Error` ( `{"error": "Internal Server Error"}` )，以避免泄露敏感错误细节。
            -   在开发环境或对于客户端错误 (4xx)，则会尝试使用错误对象中的 `message` 属性。

2.  **路由中的错误传递:**
    -   在异步路由处理函数中，原先直接处理通用错误的 `try...catch` 块被修改。现在，这些 `catch` 块通过调用 `next(error)` 将错误对象传递给中央错误处理中间件。
    -   特定于路由的错误检查（例如，无效输入导致 `400 Bad Request`，或服务层明确返回 `null` 表示未找到资源导致 `404 Not Found`）仍然在路由级别处理，以提供更精确的上下文。

**采用进度:**
-   此中央错误处理机制已在 `backend/src/index.ts` 中集成。
-   `backend/src/routes/familyMemberRoutes.ts` 已被重构以使用此新机制。
-   其他路由文件将逐步进行类似的重构，以实现全项目范围内的错误处理一致性。

这种方法有助于保持路由处理函数的简洁性，专注于业务逻辑，同时确保错误得到统一和安全的处理。
