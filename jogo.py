import openmesh as om
import numpy as np

# Criação de uma malha triangular simples
mesh = om.TriMesh()

# Adicionar vértices
v1 = mesh.add_vertex([0, 0, 0])
v2 = mesh.add_vertex([1, 0, 0])
v3 = mesh.add_vertex([0, 1, 0])

# Adicionar face
mesh.add_face(v1, v2, v3)

# Visualizar a malha
om.write_mesh('simple_mesh.off', mesh)

# Função para parametrizar o bordo em uma circunferência unitária
def parametrizar_bordo(mesh, boundary_vertices):
    total_length = sum(mesh.calc_edge_length(mesh.edge_handle(he)) for he in mesh.halfedges())
    length = 0
    for v in boundary_vertices:
        length += mesh.calc_edge_length(mesh.edge_handle(mesh.halfedge_handle(v)))
        t = 2.0 * np.pi * length / total_length
        texcoord2D = np.array([np.sin(t), np.cos(t)], dtype='f')
        mesh.set_texcoord2D(v, texcoord2D)

# Construção e solução do sistema de equações lineares
def resolver_sistema_linear(InteriorMatrix, BoundaryMatrix, vBoundaryTexCoord):
    Identity = np.identity(len(InteriorMatrix))
    A = Identity - InteriorMatrix
    B = np.dot(BoundaryMatrix, vBoundaryTexCoord)
    return np.linalg.solve(A, B)