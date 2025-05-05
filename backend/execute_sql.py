import sqlite3

with open("seed_data.sql", "r") as f:
    sql = f.read()

conn = sqlite3.connect("database.db")
cur = conn.cursor()
cur.executescript(sql)
conn.commit()
conn.close()