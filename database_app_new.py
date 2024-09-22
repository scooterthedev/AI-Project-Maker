import os
import shutil
import sqlite3
import sys

import bsdiff4
import requests
from PyQt6.QtSvgWidgets import QSvgWidget
from PyQt6.QtWidgets import QApplication, QWidget, QVBoxLayout, QLineEdit, QListWidget, QLabel, QComboBox, QDialog, \
    QPushButton, QHBoxLayout, QListWidgetItem, QSplitter

PATCH_URL = "https://talkufy.com/database_app_new.py"  # Update with your patch URL
VERSION_URL = "https://talkufy.com/version.json"  # Update with your version URL
CURRENT_VERSION = "1.0.1"  # Update to your current version

def connect_database():
    return sqlite3.connect('icons8.db')

def get_sorted_icons():
    conn = connect_database()
    cursor = conn.cursor()
    cursor.execute('SELECT id, name, tags, file_path FROM icons ORDER BY name')
    icons = cursor.fetchall()
    conn.close()
    return icons

def search_icons(icons, target, selected_tag):
    results = [icon for icon in icons if
               target.lower() in icon[1].lower() and (selected_tag == "Select Tag" or selected_tag in icon[2])]
    return results

def get_default_download_location():
    try:
        with open('download_location.txt', 'r') as f:
            return f.read().strip()
    except FileNotFoundError:
        return os.path.join(os.path.expanduser("~"), "Downloads")

def check_for_updates():
    try:
        response = requests.get(VERSION_URL)
        latest_version = response.text.strip()
        if latest_version > CURRENT_VERSION:
            print(f"New version available: {latest_version}")
            download_patch()
        else:
            print("No updates available.")
    except Exception as e:
        print(f"Error checking for updates: {e}")

def download_patch():
    patch_file = "update.patch"
    response = requests.get(PATCH_URL)

    with open(patch_file, "wb") as file:
        file.write(response.content)

    print("Patch downloaded. Applying update...")
    apply_patch(patch_file)

def apply_patch(patch_file):
    try:
        bsdiff4.patch("database_app.py", "database_app_new.py")
        os.replace("database_app_new.py", "database_app.py")  # Replace old Python file with the new one
        print("Update applied successfully!")
    except Exception as e:
        print(f"Error applying patch: {e}")

class IconViewDialog(QDialog):
    def __init__(self, icon):
        super().__init__()

        self.setWindowTitle(f'Detailed View - {icon[1]}')
        self.layout = QVBoxLayout()
        self.setLayout(self.layout)

        downloads_folder = os.path.join(os.path.expanduser("~"), "IdeaProjects")
        self.file_path = os.path.join(downloads_folder, "Icons8", "venv", f"{icon[3]}")
        self.file_path = self.file_path.replace(os.sep, '/')
        print(f"Loading image from file path: {self.file_path}")

        self.image_widget = QSvgWidget()
        self.image_widget.setFixedSize(100, 100)  # Set fixed size to 100x100
        self.layout.addWidget(self.image_widget)

        self.loading_label = QLabel("Loading...")
        self.layout.addWidget(self.loading_label)

        self.download_button = QPushButton('Download Icon')
        self.download_button.clicked.connect(self.download_icon)
        self.layout.addWidget(self.download_button)

        self.load_icon()

    def load_icon(self):
        try:
            self.image_widget.load(self.file_path)
            self.loading_label.hide()
        except Exception as e:
            print(f"Failed to load SVG: {e}")
            self.loading_label.setText("Failed to load SVG")

    def download_icon(self):
        default_download_path = get_default_download_location()
        destination_path = os.path.join(default_download_path, os.path.basename(self.file_path))
        shutil.copyfile(self.file_path, destination_path)
        print(f"Icon downloaded to: {destination_path}")

class SettingsDialog(QDialog):
    def __init__(self):
        super().__init__()

        self.setWindowTitle('Settingsssssssss')
        self.layout = QVBoxLayout()
        self.setLayout(self.layout)

        self.download_location_label = QLabel('Download Location:')
        self.layout.addWidget(self.download_location_label)

        self.download_location_input = QLineEdit(get_default_download_location())
        self.layout.addWidget(self.download_location_input)

        self.check_updates_button = QPushButton('Check for Updates')
        self.check_updates_button.clicked.connect(self.check_for_updates)
        self.layout.addWidget(self.check_updates_button)

        self.save_button = QPushButton('Save')
        self.save_button.clicked.connect(self.save_settings)
        self.layout.addWidget(self.save_button)

    def check_for_updates(self):
        check_for_updates()

    def save_settings(self):
        download_location = self.download_location_input.text()
        with open('download_location.txt', 'w') as f:
            f.write(download_location)
        print(f"Download location set to: {download_location}")
        self.close()

class IconSearchApp(QWidget):
    def __init__(self):
        super().__init__()

        self.setWindowTitle('Icon8 Search!')
        self.resize(800, 600)  # Set the default window size to 800x600
        self.layout = QVBoxLayout()
        self.setLayout(self.layout)

        self.splitter = QSplitter()
        self.layout.addWidget(self.splitter)

        self.left_widget = QWidget()
        self.left_layout = QVBoxLayout()
        self.left_widget.setLayout(self.left_layout)

        self.right_widget = QWidget()
        self.right_layout = QVBoxLayout()
        self.right_widget.setLayout(self.right_layout)

        self.splitter.addWidget(self.left_widget)
        self.splitter.addWidget(self.right_widget)

        self.label = QLabel('Welcome to the Icon8 Search Software!')
        self.left_layout.addWidget(self.label)

        self.search_bar = QLineEdit()
        self.search_bar.setPlaceholderText('Enter icon name to search')
        self.left_layout.addWidget(self.search_bar)

        self.tag_selector = QComboBox()
        self.left_layout.addWidget(self.tag_selector)

        self.search_button = QPushButton('Search')
        self.search_button.clicked.connect(self.search_icons)
        self.left_layout.addWidget(self.search_button)

        self.results_list = QListWidget()
        self.results_list.itemDoubleClicked.connect(self.show_icon_details)
        self.left_layout.addWidget(self.results_list)

        self.settings_button = QPushButton('Settings')
        self.settings_button.clicked.connect(self.open_settings_dialog)
        self.left_layout.addWidget(self.settings_button)

        self.prev_page_button = QPushButton('Previous Page')
        self.prev_page_button.clicked.connect(self.prev_page)
        self.left_layout.addWidget(self.prev_page_button)
        self.prev_page_button.hide()

        self.next_page_button = QPushButton('Next Page')
        self.next_page_button.clicked.connect(self.next_page)
        self.left_layout.addWidget(self.next_page_button)
        self.next_page_button.hide()

        self.file_preview_label = QLabel('File Preview:')
        self.right_layout.addWidget(self.file_preview_label)

        self.file_preview_widget = QSvgWidget()
        self.file_preview_widget.setFixedSize(200, 200)
        self.right_layout.addWidget(self.file_preview_widget)

        self.icons = get_sorted_icons()
        self.current_page = 0
        self.default_download_location = os.path.join(os.path.expanduser("~"), "Downloads")
        self.max_results = 10
        self.total_matches = 0

    def search_icons(self):
        self.current_page = 0
        self.load_page()

    def load_page(self):
        target = self.search_bar.text()
        selected_tag = self.tag_selector.currentText()
        if target:
            matches = search_icons(self.icons, target, selected_tag)
            self.total_matches = len(matches)
            self.results_list.clear()
            self.tag_selector.clear()

            if matches:
                start_index = self.current_page * self.max_results
                end_index = start_index + self.max_results
                page_matches = matches[start_index:end_index]

                self.results_list.addItem(f"Found {self.total_matches} matching icon(s):")

                all_tags = set()
                for icon_id, name, tags, file_path in page_matches:
                    item_widget = QWidget()
                    item_layout = QHBoxLayout()
                    item_widget.setLayout(item_layout)

                    svg_widget = QSvgWidget()
                    svg_widget.setFixedSize(50, 50)
                    svg_widget.load(file_path)
                    item_layout.addWidget(svg_widget)

                    item_text = f"Name: {name}, ID: {icon_id}, Tags: {tags}, File Path: {file_path}"
                    text_label = QLabel(item_text)
                    item_layout.addWidget(text_label)

                    list_item = QListWidgetItem(self.results_list)
                    list_item.setSizeHint(item_widget.sizeHint())
                    self.results_list.setItemWidget(list_item, item_widget)

                    all_tags.update(tags.split(','))

                self.tag_selector.addItem("Select Tag")
                self.tag_selector.addItems(sorted(all_tags))

                self.update_pagination_buttons()
            else:
                self.results_list.addItem(f"No icons found matching the name '{target}'.")

    def update_pagination_buttons(self):
        if self.current_page > 0:
            self.prev_page_button.show()
        else:
            self.prev_page_button.hide()

        if (self.current_page + 1) * self.max_results < self.total_matches:
            self.next_page_button.show()
        else:
            self.next_page_button.hide()

    def next_page(self):
        if (self.current_page + 1) * self.max_results < self.total_matches:
            self.current_page += 1
            self.load_page()

    def prev_page(self):
        if self.current_page > 0:
            self.current_page -= 1
            self.load_page()

    def show_icon_details(self, item):
        selected_icon = self.results_list.currentItem()
        if selected_icon:
            icon_id = selected_icon.text().split(",")[1].split(":")[1].strip()
            icon_details = next((icon for icon in self.icons if icon[0] == icon_id), None)
            if icon_details:
                dialog = IconViewDialog(icon_details)
                dialog.exec()

    def open_settings_dialog(self):
        dialog = SettingsDialog()
        dialog.exec()

if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = IconSearchApp()
    window.show()
    sys.exit(app.exec())
