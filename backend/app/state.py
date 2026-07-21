import json
class StateStore:
    """ 
    para o funcionamento adequado do programa, eh indispensavel que self.data armazene um dicionario.
    portanto, em qualquer lugar que StateStore.set() for utilizado, certifique-se de que o conteudo
    esta sendo transformado em um dicionario antes. 
    """
    def __init__(self,name=""):
        self.data = None
        self.prefix = f"event: {name}\ndata: "
        self.suffix = '\n\n'
    def set(self, data):
        self.data = data
    def get(self):
        return self.data
    def get_msg(self):
        return self.prefix + json.dumps(self.data) + self.suffix
last_row = StateStore("row")
last_error = StateStore("error")
