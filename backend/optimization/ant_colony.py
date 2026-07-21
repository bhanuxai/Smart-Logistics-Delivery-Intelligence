import random

from optimization.graph import LogisticsGraph


class AntColonyOptimizer:

    def __init__(
        self,
        num_ants=30,
        iterations=50,
        alpha=1,
        beta=2,
        evaporation=0.5,
        q=100,
    ):

        self.graph = LogisticsGraph()

        self.num_ants = num_ants
        self.iterations = iterations

        self.alpha = alpha
        self.beta = beta
        self.evaporation = evaporation
        self.q = q

        self.pheromone = {}

        for node in self.graph.get_nodes():
            self.pheromone[node] = {}

            for neighbor in self.graph.get_neighbors(node):
                self.pheromone[node][neighbor] = 1.0

    # --------------------------------------------------------
    # Construct a route for one ant
    # --------------------------------------------------------

    def construct_route(self, start, destination):

        current = start

        visited = {start}

        path = [start]

        total_distance = 0

        while current != destination:

            neighbors = self.graph.get_neighbors(current)

            choices = []
            probabilities = []

            for neighbor, distance in neighbors.items():

                if neighbor in visited:
                    continue

                pheromone = self.pheromone[current][neighbor]

                visibility = 1 / distance

                probability = (
                    (pheromone ** self.alpha)
                    * (visibility ** self.beta)
                )

                choices.append((neighbor, distance))
                probabilities.append(probability)

            if not choices:
                return None, float("inf")

            probability_sum = sum(probabilities)

            probabilities = [
                p / probability_sum for p in probabilities
            ]

            selected = random.choices(
                choices,
                weights=probabilities,
                k=1,
            )[0]

            next_node, distance = selected

            path.append(next_node)

            visited.add(next_node)

            total_distance += distance

            current = next_node

        return path, total_distance

    # --------------------------------------------------------
    # Evaporate pheromone
    # --------------------------------------------------------

    def evaporate(self):

        for node in self.pheromone:

            for neighbor in self.pheromone[node]:

                self.pheromone[node][neighbor] *= (
                    1 - self.evaporation
                )

                if self.pheromone[node][neighbor] < 0.1:
                    self.pheromone[node][neighbor] = 0.1

    # --------------------------------------------------------
    # Deposit pheromone
    # --------------------------------------------------------

    def deposit(self, path, distance):

        if path is None:
            return

        pheromone_to_add = self.q / distance

        for i in range(len(path) - 1):

            start = path[i]
            end = path[i + 1]

            self.pheromone[start][end] += pheromone_to_add

    # --------------------------------------------------------
    # Main Optimization
    # --------------------------------------------------------

    def optimize(self, start, destination):

        best_path = None
        best_distance = float("inf")

        for _ in range(self.iterations):

            all_paths = []

            for _ in range(self.num_ants):

                path, distance = self.construct_route(
                    start,
                    destination,
                )

                if path is not None:

                    all_paths.append((path, distance))

                    if distance < best_distance:

                        best_distance = distance
                        best_path = path

            self.evaporate()

            for path, distance in all_paths:

                self.deposit(path, distance)

        return {
            "best_route": best_path,
            "distance": round(best_distance, 2),
            "estimated_time": round(best_distance / 60, 2),
            "fuel_estimate": round(best_distance / 12, 2),
            "algorithm": "Ant Colony Optimization",
        }