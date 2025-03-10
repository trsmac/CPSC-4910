# Generated by Django 5.1.6 on 2025-03-02 23:21

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Inventory",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "batch_number",
                    models.CharField(blank=True, max_length=100, null=True),
                ),
                ("serial_number", models.CharField(max_length=100, unique=True)),
                ("quantity", models.IntegerField(default=0)),
                ("location", models.CharField(blank=True, max_length=255, null=True)),
                ("last_updated", models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name="Product",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("product_name", models.CharField(max_length=255)),
                ("description", models.TextField(blank=True, null=True)),
                ("category", models.CharField(blank=True, max_length=100, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name="Role",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("role_name", models.CharField(max_length=50, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name="InventoryHistory",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "action",
                    models.CharField(
                        choices=[
                            ("received", "Received"),
                            ("sold", "Sold"),
                            ("damaged", "Damaged"),
                            ("adjustment", "Adjustment"),
                        ],
                        max_length=20,
                    ),
                ),
                ("quantity", models.IntegerField()),
                ("transaction_date", models.DateTimeField(auto_now_add=True)),
                (
                    "inventory",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="app1.inventory"
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="inventory",
            name="product",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="app1.product"
            ),
        ),
        migrations.CreateModel(
            name="Permission",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("permission_name", models.CharField(max_length=100)),
                (
                    "role",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="app1.role"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="User",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("username", models.CharField(max_length=50, unique=True)),
                ("email", models.EmailField(max_length=254, unique=True)),
                ("password_hash", models.TextField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "role",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="app1.role",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="ReportExport",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "file_format",
                    models.CharField(
                        choices=[("CSV", "CSV"), ("PDF", "PDF"), ("Excel", "Excel")],
                        max_length=10,
                    ),
                ),
                ("file_name", models.CharField(max_length=255)),
                ("generated_at", models.DateTimeField(auto_now_add=True)),
                (
                    "user",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="app1.user",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="ActivityLog",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("action", models.CharField(max_length=255)),
                ("timestamp", models.DateTimeField(auto_now_add=True)),
                (
                    "user",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="app1.user",
                    ),
                ),
            ],
        ),
    ]
