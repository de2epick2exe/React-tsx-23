import sys
import commands as commands
from PySide6.QtWidgets import QApplication, QWidget, QLabel, QPushButton, QVBoxLayout, QTextEdit
from PySide6.QtCore import QTextStream, Qt
from PySide6.QtGui import QTextCursor

class ConsoleRedirector:
    def __init__(self, text_edit):
        self.text_edit = text_edit

    def write(self, text):
        cursor = self.text_edit.textCursor()
        cursor.movePosition(QTextCursor.End)
        cursor.insertText(text)
        self.text_edit.setTextCursor(cursor)
        self.text_edit.ensureCursorVisible()

class TestApp(QWidget):
    def __init__(self):
        super().__init__()
        self.init_ui()

    def init_ui(self):
        self.setWindowTitle("PySide6 Test")
        self.setGeometry(100, 100, 1024, 720)
        self.setStyleSheet("""
            background-color: #404040;
            color: white;
        """)

        # Widgets
        self.label = QLabel("Server status: OFF", self)
        self.label.move(50, 50)

        self.button_start = QPushButton("Start server", self)
        self.button_start.clicked.connect(self.on_button_click_start)
        self.button_start.setFixedSize(200, 30)
        self.button_start.setStyleSheet("""
            background-color: #00FF00;
            color: black;
            border: 2px solid #1c7430;
            border-radius: 10px;
            padding: 5px 10px;
        """)
        self.button_start.move(50, 100)

        self.button_stop = QPushButton("Stop server", self)
        self.button_stop.clicked.connect(self.on_button_click_stop)
        self.button_stop.setFixedSize(200, 30)
        self.button_stop.setStyleSheet("""
            background-color: #FF0000;
            color: black;
            border: 1px solid #BF6565;
            border-radius: 10px;
            padding: 5px 10px;
        """)
        self.button_stop.move(50, 150)

        self.console_output = QTextEdit(self)
        self.console_output.setGeometry(300, 50, 700, 400)
        self.console_output.setStyleSheet("""
            background-color: #303030;
            color: white;
        """)

        # Redirect console output to the QTextEdit widget
        sys.stdout = ConsoleRedirector(self.console_output)

    def on_button_click_start(self):
        self.label.setText("Server status: ON")
        commands.start_js_server()

    def on_button_click_stop(self):
        self.label.setText("Server status: OFF")
        commands.stop_js_server()

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = TestApp()
    window.show()
    sys.exit(app.exec())
  