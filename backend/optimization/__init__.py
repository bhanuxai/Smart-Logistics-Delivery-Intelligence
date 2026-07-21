from .ant_colony import AntColonyOptimizer

aco = AntColonyOptimizer()

result = aco.optimize(
    "São Paulo Warehouse",
    "Rio Distribution Center"
)

print(result)