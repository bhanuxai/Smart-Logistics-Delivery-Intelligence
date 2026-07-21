# graph.py

class LogisticsGraph:
    def __init__(self):
        self.graph = {
            "São Paulo Warehouse": {
                "Campinas Hub": 95,
                "Sorocaba Hub": 110
            },

            "Campinas Hub": {
                "São Paulo Warehouse": 95,
                "Ribeirão Preto Hub": 210,
                "Rio Distribution Center": 430
            },

            "Sorocaba Hub": {
                "São Paulo Warehouse": 110,
                "Curitiba Hub": 320
            },

            "Curitiba Hub": {
                "Sorocaba Hub": 320,
                "Rio Distribution Center": 520
            },

            "Ribeirão Preto Hub": {
                "Campinas Hub": 210,
                "Rio Distribution Center": 340
            },

            "Rio Distribution Center": {
                "Campinas Hub": 430,
                "Curitiba Hub": 520,
                "Ribeirão Preto Hub": 340
            }
        }

    def get_nodes(self):
        return list(self.graph.keys())

    def get_neighbors(self, node):
        return self.graph[node]

    def get_distance(self, start, end):
        return self.graph[start][end]