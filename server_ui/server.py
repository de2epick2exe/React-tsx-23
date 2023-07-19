import commands as commands
import tkinter as ui 

root = ui.Tk()
root.geometry("1024x576")
root.configure(background='black')
frm = ui.Frame(root)
frm.grid()
ui.Button(frm, text='Start server', command=commands.start_js_server, background='aqua').grid(column=1, row=0)
ui.Button(frm, text='Stop server', command=commands.stop_js_server, background='red').grid(column=2, row=0)
root.mainloop()
