from app.db import SessionLocal
from app import models

def seed_inventory():
    db = SessionLocal()
    demo = [
        models.Inventory(name="Screws", description="Size 10 philips screws", quantity=200),
        models.Inventory(name="Wrench", description="Adjustable wrench", quantity=5),
        models.Inventory(name="Impact Drill", description="Milwaukee impact drill", quantity=2),
    ]
    for e in demo:
        db.add(e)
    db.commit()
    db.close()
    print(f"Seeded {len(demo)} inventory items.")

if __name__ == "__main__":
    seed_inventory()