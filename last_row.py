class last_row():
    def __init__(self):
        self.recebendo_dados = True
        self.last_row = None
    def update_row(self, row):
        self.last_row = row
    def get_row(self):
        return self.last_row
    def set_recebendo_dados(self, booleano):
        self.recebendo_dados = booleano

global last_row_instance 
last_row_instance = last_row()