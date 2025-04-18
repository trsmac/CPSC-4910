from django.http import JsonResponse, HttpResponse
from django.contrib.auth.decorators import login_required
from ..models import InventoryItem
from .utils import get_filtered_inventory

import csv
from openpyxl import Workbook
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors

@login_required
def export_inventory_csv(request):
    items = get_filtered_inventory(request)
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="inventory.csv"'

    writer = csv.writer(response)
    writer.writerow(['Item Code', 'Item Name', 'Category', 'Quantity', 'Barcode', 'Notes'])
    for item in items:
        writer.writerow([item.item_code, item.item_name, item.category_type, item.quantity, item.barcode, item.notes])
    return response


@login_required
def export_inventory_excel(request):
    items = get_filtered_inventory(request)
    wb = Workbook()
    ws = wb.active
    ws.title = "Inventory"
    ws.append(['Item Code', 'Item Name', 'Category', 'Quantity', 'Barcode', 'Notes'])

    for item in items:
        ws.append([item.item_code, item.item_name, item.category_type, item.quantity, item.barcode, item.notes])

    response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = 'attachment; filename="inventory.xlsx"'
    wb.save(response)
    return response


@login_required
def export_inventory_json(request):
    items = get_filtered_inventory(request)
    data = [dict(
        item_code=item.item_code,
        item_name=item.item_name,
        category=item.category_type,
        quantity=item.quantity,
        barcode=item.barcode,
        notes=item.notes,
    ) for item in items]
    return JsonResponse(data, safe=False)


@login_required
def export_inventory_pdf(request):
    items = get_filtered_inventory(request)
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="inventory.pdf"'

    doc = SimpleDocTemplate(response, pagesize=letter)
    styles = getSampleStyleSheet()
    elements = [Paragraph("Trackalytics Inventory Report", styles["Title"])]

    data = [['Item Code', 'Item Name', 'Category', 'Qty', 'Barcode', 'Notes']]
    for item in items:
        data.append([
            item.item_code, item.item_name, item.category_type,
            str(item.quantity), item.barcode or '', item.notes or ''
        ])

    table = Table(data, repeatRows=1)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.darkblue),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ]))
    elements.append(table)
    doc.build(elements)
    return response
