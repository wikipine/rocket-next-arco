# Rocket-Next-Arco

## 说明

基于 NextJS12 + Arco Design React Pro 改造的中后台快速开发框架，对此进行了大量的基础优化

## 特性&目录

主要对业务模块进行了更加细化的拆分, 如统一的数据管理，简化路由权限管理，多环境系统配置，集成状态管理(redux), layout 解耦

### api 目录

统一的数据管理中心，mock 也需要在此管理

### config 目录

路由，缓存，系统设置，语言包 等配置设置处

### env 目录

环境变量声明处，内置**dev, prod, test, local**启动方式

### store 目录

基于 redux + @reduxjs/toolkit 维护的 store 统一写法

## route 权限

取消了原 **read,write** 的权限方式，改为 **role** 方式，目前内置 admin, manager, user, 可随意扩展

```bash
admin: 1
manger: 2
user: 3
```

数值越小，权限越大，仅需要在 config/routes.ts 中配置即可, 权限目前到**页面级别**
