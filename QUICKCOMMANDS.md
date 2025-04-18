sudo bash -c '
output="/workspaces/CPSC-4910/combined_all_output.txt"
> "$output"

# Add file hierarchy and directory info
echo -e "===== DIRECTORY LISTING: ls /workspaces/CPSC-4910 =====\n" >> "$output"
ls /workspaces/CPSC-4910 >> "$output"

echo -e "\n===== CHANGING DIRECTORY TO: trackalytics_project =====\n" >> "$output"

echo -e "\n===== FILE TREE (trackalytics_project) =====\n" >> "$output"
tree /workspaces/CPSC-4910/trackalytics_project >> "$output"

# Combine HTML templates
for file in \
"access_denied.html" \
"activitylog.html" \
"base.html" \
"inventory.html" \
"kpi-dashboard.html" \
"login.html" \
"main-dashboard.html" \
"password_reset_complete.html" \
"password_reset_confirm.html" \
"password_reset_done.html" \
"password_reset_email.html" \
"password_reset_form.html" \
"password_reset_subject.txt" \
"reservation.html" \
"roles.html" \
"signup.html"; do
  echo -e "\n\n===== START OF TEMPLATE: $file =====\n" >> "$output"
  cat "/workspaces/CPSC-4910/trackalytics_project/trackalytics/templates/$file" >> "$output"
  echo -e "\n===== END OF TEMPLATE: $file =====\n" >> "$output"
done

# Combine CSS files
for file in \
"activitylog.css" \
"dashboard.css" \
"inventory.css" \
"login.css" \
"reservation.css" \
"roles.css" \
"setting.css"; do
  echo -e "\n\n===== START OF CSS: $file =====\n" >> "$output"
  cat "/workspaces/CPSC-4910/trackalytics_project/trackalytics/static/css/$file" >> "$output"
  echo -e "\n===== END OF CSS: $file =====\n" >> "$output"
done

# Combine JS files
for file in \
"activitylog.js" \
"dashboard.js" \
"inventory.js" \
"reservation.js" \
"role.js"; do
  echo -e "\n\n===== START OF JS: $file =====\n" >> "$output"
  cat "/workspaces/CPSC-4910/trackalytics_project/trackalytics/static/js/$file" >> "$output"
  echo -e "\n===== END OF JS: $file =====\n" >> "$output"
done

# Combine Django and project-level files
for file in \
"trackalytics/admin.py" \
"trackalytics/apps.py" \
"trackalytics/auth_backends.py" \
"trackalytics/forms.py" \
"trackalytics/models.py" \
"trackalytics/tests.py" \
"trackalytics/urls.py" \
"trackalytics/views.py" \
"trackalytics_project/settings.py" \
"trackalytics_project/urls.py" \
"manage.py" \
"trackalytics_project/wsgi.py" \
"trackalytics_project/asgi.py" \
".gitignore" \
"requirements.txt" \
"run.sh"; do
  echo -e "\n\n===== START OF DJANGO FILE: $file =====\n" >> "$output"
  cat "/workspaces/CPSC-4910/trackalytics_project/$file" >> "$output"
  echo -e "\n===== END OF DJANGO FILE: $file =====\n" >> "$output"
done
'
