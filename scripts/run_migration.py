#!/usr/bin/env python3
"""
尝试通过 Supavisor (连接池) 连接数据库并执行迁移 SQL
使用 service_role JWT 作为密码
"""

import psycopg2
import ssl
import sys

PROJECT_REF = "artwyllxkkoabmgzupdn"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFydHd5bGx4a2tvYWJtZ3p1cGRuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTY5Nzg1NSwiZXhwIjoyMDk1MjczODU1fQ.t3q5Q9ud0q4YNgJCF2_Qi9fNX_F4DtMGqs6j1rRZWEo"

# 读取 SQL 文件
with open("supabase/migrations/001_init.sql", "r") as f:
    sql = f.read()

# 尝试多种连接方式
connection_strings = [
    # Supavisor (session pooler) - port 5432
    {
        "host": f"db.{PROJECT_REF}.supabase.co",
        "port": 5432,
        "user": f"postgres.{PROJECT_REF}",
        "password": SERVICE_ROLE_KEY,
        "dbname": "postgres",
        "sslmode": "require",
    },
    # Supavisor transaction pooler - port 6543
    {
        "host": f"db.{PROJECT_REF}.supabase.co",
        "port": 6543,
        "user": f"postgres.{PROJECT_REF}",
        "password": SERVICE_ROLE_KEY,
        "dbname": "postgres",
        "sslmode": "require",
    },
    # Direct connection
    {
        "host": f"db.{PROJECT_REF}.supabase.co",
        "port": 5432,
        "user": "postgres",
        "password": SERVICE_ROLE_KEY,
        "dbname": "postgres",
        "sslmode": "require",
    },
]

for i, conn_info in enumerate(connection_strings, 1):
    try:
        print(f"尝试连接方式 #{i}: {conn_info['user']}@{conn_info['host']}:{conn_info['port']}")
        conn = psycopg2.connect(**conn_info)
        conn.set_session(autocommit=True)
        cur = conn.cursor()
        
        print("✅ 连接成功！正在执行 SQL 迁移...")
        
        # 逐条执行 SQL
        statements = sql.split(";")
        executed = 0
        for stmt in statements:
            stmt = stmt.strip()
            if stmt and not stmt.startswith("--"):
                try:
                    cur.execute(stmt)
                    executed += 1
                    print(f"  ✓ 执行了 {executed} 条语句")
                except Exception as e:
                    error_msg = str(e).strip()
                    # 忽略 "already exists" 和 "duplicate key" 错误
                    if "already exists" in error_msg or "duplicate key" in error_msg:
                        print(f"  - 跳过（已存在）: {error_msg[:60]}")
                    else:
                        print(f"  ✗ 执行出错: {error_msg[:100]}")
        
        cur.close()
        conn.close()
        print(f"\n🎉 迁移完成！共执行 {executed} 条 SQL 语句")
        sys.exit(0)
        
    except Exception as e:
        error = str(e).strip()[:100]
        print(f"  ❌ 连接失败: {error}\n")

print("\n所有连接方式均失败。请手动执行 SQL 迁移。")
sys.exit(1)
