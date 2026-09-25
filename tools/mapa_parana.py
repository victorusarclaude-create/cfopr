"""Gera src/38_jornada_mapa.js: o mapa do Paraná usado na Jornada do Paraná.

Fontes (baixadas uma vez para uma pasta de trabalho):
  - Divisas municipais do PR: https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-41-mun.json
  - Microrregião e coordenadas de cada município: https://raw.githubusercontent.com/mapaslivres/municipios-br/main/tabelas/municipios.csv
  - Estados, países, rios e lagos vizinhos (Natural Earth):
    https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/{ne_50m_admin_1_states_provinces,
    ne_10m_admin_0_countries,ne_10m_rivers_lake_centerlines,ne_10m_lakes}.geojson

As regiões históricas são grupos de microrregiões do IBGE, então as divisas seguem as dos municípios.
Rios que o Natural Earth não traz (Iguaçu, Tibagi), relevo e caminhos históricos são traçados
por pontos de referência (cidades por onde passam) e marcados como aproximados no app.

Uso: python3 tools/mapa_parana.py PASTA_COM_AS_FONTES   (requer shapely >= 2.1)
"""
import csv, json, math, sys
import shapely
from shapely.geometry import shape, Polygon, MultiPolygon, LineString, Point, box, mapping
from shapely.ops import unary_union, polylabel

SRC = sys.argv[1] if len(sys.argv) > 1 else '.'
OUT = 'src/38_jornada_mapa.js'

LON0, LON1, LAT0, LAT1 = -55.1, -47.8, -27.1, -22.3
COS = math.cos(math.radians(24.6))
K = 72.0
W = round((LON1 - LON0) * COS * K)
H = round((LAT1 - LAT0) * K)
VIEW = box(LON0, LAT0, LON1, LAT1)


def P(lon, lat):
    return ((lon - LON0) * COS * K, (LAT1 - lat) * K)


def fmt(v):
    s = ('%.1f' % v).rstrip('0').rstrip('.')
    return '0' if s == '-0' else s


def ring_d(coords, close=True):
    pts = [P(x, y) for x, y in coords]
    out = []
    last = None
    for i, (x, y) in enumerate(pts):
        q = (fmt(x), fmt(y))
        if q == last:
            continue
        out.append(('M' if i == 0 else 'L') + q[0] + ' ' + q[1])
        last = q
    return ''.join(out) + ('Z' if close else '')


def geom_d(g):
    if g.is_empty:
        return ''
    if isinstance(g, Polygon):
        return ring_d(g.exterior.coords) + ''.join(ring_d(r.coords) for r in g.interiors)
    if isinstance(g, (MultiPolygon,)) or g.geom_type == 'GeometryCollection':
        return ''.join(geom_d(p) for p in g.geoms if p.geom_type in ('Polygon', 'MultiPolygon'))
    if g.geom_type == 'LineString':
        return ring_d(g.coords, False)
    if g.geom_type == 'MultiLineString':
        return ''.join(ring_d(l.coords, False) for l in g.geoms)
    return ''


def smooth(pts, n=6):
    """Catmull-Rom: pontos (lat, lon) -> linha suave em (lon, lat)."""
    p = [(lon, lat) for lat, lon in pts]
    if len(p) < 3:
        return p
    out = []
    ext = [p[0]] + p + [p[-1]]
    for i in range(1, len(ext) - 2):
        p0, p1, p2, p3 = ext[i - 1], ext[i], ext[i + 1], ext[i + 2]
        for k in range(n):
            t = k / n
            t2, t3 = t * t, t * t * t
            out.append(tuple(0.5 * ((2 * p1[j]) + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3) for j in range(2)))
    out.append(p[-1])
    return out


def pt(lat, lon):
    x, y = P(lon, lat)
    return [round(x, 1), round(y, 1)]


# ---------- municípios -> microrregiões -> regiões ----------
rows = {r['municipio']: r for r in csv.DictReader(open(SRC + '/municipios-br_municipios.csv', encoding='utf-8')) if r['uf_code'] == 'PR'}
mun = json.load(open(SRC + '/mun41.json', encoding='utf-8'))
REG = {
    'litoral': ('Litoral', [38]),
    'curitiba': ('Curitiba e Primeiro Planalto', [37, 35, 39]),
    'camposgerais': ('Campos Gerais', [21, 20, 19, 36]),
    'sudeste': ('Sudeste (Vale do Iguaçu)', [31, 32, 33, 34]),
    'guarapuava': ('Campos de Guarapuava', [29, 28]),
    'palmas': ('Campos de Palmas', [30]),
    'sudoeste': ('Sudoeste', [25, 26, 27]),
    'oeste': ('Oeste', [22, 23, 24]),
    'nortepioneiro': ('Norte Pioneiro (Norte Velho)', [14, 15, 16, 17, 18]),
    'nortenovo': ('Norte Novo', [6, 7, 8, 9, 10, 11, 12]),
    'noroeste': ('Noroeste (Norte Novíssimo)', [1, 2, 3]),
    'centro': ('Centro-Oeste (Campo Mourão e Vale do Ivaí)', [4, 5, 13]),
}
mic2reg = {41000 + m: rid for rid, (_, ms) in REG.items() for m in ms}
parts = {rid: [] for rid in REG}
for f in mun['features']:
    code = f['properties']['id']
    rid = mic2reg[int(rows[code]['microregion'])]
    parts[rid].append(shape(f['geometry']).buffer(0))
ids = list(REG)
geoms = [unary_union(parts[r]) for r in ids]
simp = shapely.coverage_simplify(geoms, 0.012)
reg = dict(zip(ids, simp))
state = unary_union(simp)
state_poly = max(state.geoms, key=lambda g: g.area) if state.geom_type == 'MultiPolygon' else state


def label_pt(g):
    g = max(g.geoms, key=lambda x: x.area) if g.geom_type == 'MultiPolygon' else g
    c = polylabel(g, 0.01)
    return pt(c.y, c.x)


# ajustes finos de rótulo para regiões estreitas
LAB = {'litoral': (-25.62, -48.62), 'curitiba': (-25.2, -49.35), 'camposgerais': (-24.4, -50.3), 'sudeste': (-25.85, -50.75),
       'guarapuava': (-25.2, -51.85), 'palmas': (-26.2, -52.05), 'nortepioneiro': (-23.45, -50.35), 'nortenovo': (-23.35, -51.55)}

# ---------- vizinhos ----------
adm1 = json.load(open(SRC + '/ne_50m_admin_1_states_provinces.geojson', encoding='utf-8'))
adm0 = json.load(open(SRC + '/ne_10m_admin_0_countries.geojson', encoding='utf-8'))
nb = []
sc_geom = None
for f in adm1['features']:
    n = f['properties']['name']
    if n in ('São Paulo', 'Santa Catarina', 'Mato Grosso do Sul', 'Rio Grande do Sul'):
        g = shape(f['geometry']).buffer(0).intersection(VIEW).difference(state.buffer(0.004))
        if n == 'Santa Catarina':
            sc_geom = g
        nb.append((n, g))
for f in adm0['features']:
    n = f['properties']['NAME']
    if n in ('Paraguay', 'Argentina'):
        g = shape(f['geometry']).buffer(0).intersection(VIEW).difference(state.buffer(0.004))
        nb.append(({'Paraguay': 'Paraguai', 'Argentina': 'Argentina'}[n], g))
nb = [(n, g.simplify(0.02)) for n, g in nb if not g.is_empty and n != 'Rio Grande do Sul']
NBLAB = {'São Paulo': (-22.75, -50.6), 'Santa Catarina': (-26.85, -50.6), 'Mato Grosso do Sul': (-22.55, -53.95),
         'Paraguai': (-24.35, -54.62), 'Argentina': (-26.4, -54.15)}

# ---------- água ----------
rv = json.load(open(SRC + '/ne_10m_rivers_lake_centerlines.geojson', encoding='utf-8'))
riv = {}
for f in rv['features']:
    n = f['properties'].get('name')
    if n in ('Ivaí', 'Ribeira', 'Paraná', 'Paranapanema'):
        g = shape(f['geometry']).intersection(VIEW)
        if g.is_empty:
            continue
        key = {'Ivaí': 'ivai', 'Ribeira': 'ribeira', 'Paraná': 'parana', 'Paranapanema': 'paranapanema'}[n]
        riv[key] = unary_union([riv[key], g]) if key in riv else g
lakes = json.load(open(SRC + '/ne_10m_lakes.geojson', encoding='utf-8'))
lake = unary_union([shape(f['geometry']).intersection(VIEW) for f in lakes['features'] if f['properties'].get('name') == 'Represa Itaipu'])

# rios traçados por pontos de referência
IGUACU = [(-25.47, -49.17), (-25.56, -49.3), (-25.6, -49.45), (-25.58, -49.65), (-25.55, -49.88), (-25.66, -50.1), (-25.8, -50.3), (-25.9, -50.45),
          (-26.1, -50.75), (-26.21, -50.95), (-26.23, -51.09), (-26.17, -51.24), (-26.12, -51.45), (-26.05, -51.62), (-25.9, -51.85), (-25.8, -52.08),
          (-25.7, -52.4), (-25.62, -52.7), (-25.5, -52.95), (-25.45, -53.3), (-25.48, -53.6), (-25.55, -53.85), (-25.62, -54.1), (-25.69, -54.43), (-25.6, -54.59)]
TIBAGI = [(-25.4, -50.05), (-25.15, -50.25), (-24.8, -50.35), (-24.51, -50.41), (-24.32, -50.62), (-24.0, -50.75), (-23.7, -50.8), (-23.4, -50.95), (-23.25, -50.98), (-22.95, -51.02), (-22.78, -51.05)]
riv['iguacu'] = LineString(smooth(IGUACU))
riv['tibagi'] = LineString(smooth(TIBAGI))
RIVN = {'parana': 'Rio Paraná', 'paranapanema': 'Rio Paranapanema', 'iguacu': 'Rio Iguaçu', 'tibagi': 'Rio Tibagi', 'ivai': 'Rio Ivaí', 'ribeira': 'Rio Ribeira'}
RIVLAB = {'parana': (-23.6, -54.2, -62), 'paranapanema': (-22.7, -51.7, -8), 'iguacu': (-26.02, -51.72, -30), 'tibagi': (-24.05, -50.62, -70),
          'ivai': (-24.15, -51.85, -45), 'ribeira': (-24.72, -48.95, -35)}

# ---------- relevo ----------
serra_mar = reg['litoral'].boundary.intersection(reg['curitiba'].boundary)
DEVONIANA = [(-24.02, -49.38), (-24.25, -49.55), (-24.55, -49.8), (-24.85, -49.88), (-25.15, -49.82), (-25.45, -49.7), (-25.7, -49.66), (-25.95, -49.72), (-26.12, -49.82)]
ESPERANCA = [(-23.2, -49.78), (-23.55, -49.98), (-23.85, -50.35), (-24.15, -50.75), (-24.55, -50.95), (-24.95, -51.05), (-25.3, -51.2), (-25.65, -51.25), (-26.0, -51.35), (-26.35, -51.3)]
rel = {'serramar': serra_mar, 'devoniana': LineString(smooth(DEVONIANA)).intersection(state_poly.buffer(0.02)),
       'esperanca': LineString(smooth(ESPERANCA)).intersection(state_poly.buffer(0.02))}
RELN = {'serramar': 'Serra do Mar', 'devoniana': 'Escarpa Devoniana', 'esperanca': 'Serra Geral (da Esperança)'}
RELLAB = {'serramar': (-25.2, -48.93, -62), 'devoniana': (-24.62, -49.62, -68), 'esperanca': (-24.72, -50.78, -72)}
PLAN = {'p1': ('1º planalto', -25.62, -49.28), 'p2': ('2º planalto', -24.95, -50.28), 'p3': ('3º planalto', -24.5, -52.6)}

# ---------- cidades ----------
CITY = ['Curitiba', 'Paranaguá', 'Antonina', 'Morretes', 'Guaratuba', 'Guaraqueçaba', 'Lapa', 'Palmeira', 'Ponta Grossa', 'Castro', 'Jaguariaíva', 'Sengés',
        'Piraí do Sul', 'Tibagi', 'Carambeí', 'Rio Negro', 'Guarapuava', 'Palmas', 'Clevelândia', 'União da Vitória', 'Prudentópolis', 'Irati', 'Mallet',
        'São Mateus do Sul', 'Londrina', 'Maringá', 'Apucarana', 'Rolândia', 'Jacarezinho', 'Cambará', 'Santo Antônio da Platina', 'Tomazina',
        'Cornélio Procópio', 'Assaí', 'Porecatu', 'Paranavaí', 'Umuarama', 'Cianorte', 'Campo Mourão', 'Peabiru', 'Fênix', 'Cascavel', 'Toledo',
        'Foz do Iguaçu', 'Guaíra', 'Francisco Beltrão', 'Pato Branco', 'Laranjeiras do Sul', 'Capanema', 'Santo Antônio do Sudoeste', 'Telêmaco Borba',
        'Campo Largo', 'São José dos Pinhais', 'Quatro Barras', 'Arapoti', 'Wenceslau Braz', 'Siqueira Campos', 'Pitanga', 'Candói', 'Chopinzinho',
        'Marechal Cândido Rondon', 'Medianeira', 'Ivaiporã', 'Teixeira Soares', 'Imbituva', 'Porto Amazonas', 'Balsa Nova', 'Campo do Tenente']
byname = {r['name']: r for r in rows.values()}
city = {}
for n in CITY:
    r = byname[n]
    city[n] = pt(float(r['lat']), float(r['lon']))
EXTRA = {'Cataratas do Iguaçu': (-25.695, -54.437), 'Itaipu': (-25.408, -54.589), 'Sete Quedas (submersa)': (-24.03, -54.26),
         'Vila Velha': (-25.25, -50.0), 'Pico Paraná': (-25.25, -48.81), 'Ilha da Cotinga': (-25.53, -48.44), 'Ilha do Mel': (-25.55, -48.32),
         'Loreto e Santo Inácio (reduções)': (-22.72, -52.05), 'Villa Rica del Espíritu Santo': (-23.9, -52.0),
         'Ciudad Real del Guairá': (-24.16, -54.1), 'Irani (SC)': (-27.03, -51.9), 'Sorocaba (SP) →': (-23.5, -47.9),
         'Viamão (RS) ↓': (-27.05, -50.1), 'Três Barras (SC)': (-26.11, -50.32), 'Porto União (SC)': (-26.24, -51.08)}
for n, (la, lo) in EXTRA.items():
    city[n] = pt(la, lo)

# ---------- caminhos e frentes ----------
C = lambda n: (float(byname[n]['lat']), float(byname[n]['lon']))
RT = {
    'tropas': [(-27.1, -50.05), C('Campo do Tenente'), C('Lapa'), C('Palmeira'), C('Ponta Grossa'), C('Castro'), C('Piraí do Sul'), C('Jaguariaíva'), C('Sengés'), (-24.0, -49.2), (-23.55, -47.85)],
    'peabiru': [C('Paranaguá'), C('Curitiba'), (-25.25, -49.85), C('Ponta Grossa'), C('Tibagi'), (-24.6, -51.1), C('Pitanga'), (-24.3, -52.1), C('Peabiru'), (-23.95, -53.1), C('Guaíra'), (-24.4, -55.05)],
    'cabeza': [(-26.62, -48.62), (-26.25, -49.35), (-25.65, -50.1), (-25.35, -50.9), (-25.4, -51.7), (-25.55, -52.6), (-25.5, -53.4), (-25.69, -54.43), (-25.4, -55.05)],
    'itupava': [C('Curitiba'), C('Quatro Barras'), (-25.42, -48.93), C('Morretes'), C('Paranaguá')],
    'graciosa': [C('Curitiba'), C('Quatro Barras'), (-25.34, -48.93), C('Antonina')],
    'ferrovia': [C('Paranaguá'), C('Morretes'), (-25.44, -48.93), (-25.46, -49.08), C('Curitiba')],
    'ferropg': [C('Curitiba'), C('Campo Largo'), C('Balsa Nova'), C('Porto Amazonas'), C('Palmeira'), C('Ponta Grossa')],
    'sprg': [(-24.08, -49.34), C('Jaguariaíva'), C('Piraí do Sul'), C('Castro'), C('Ponta Grossa'), C('Teixeira Soares'), C('Irati'), C('Mallet'), C('União da Vitória'), (-26.6, -51.2), (-27.1, -51.4)],
    'cafe': [(-22.98, -49.87), C('Cambará'), C('Cornélio Procópio'), C('Londrina'), C('Apucarana'), C('Maringá'), C('Cianorte'), C('Umuarama')],
    'guarapuava': [C('Curitiba'), C('Palmeira'), (-25.3, -50.55), (-25.35, -51.05), C('Guarapuava')],
    'palmas': [C('Guarapuava'), (-25.85, -51.75), C('Palmas')],
    'missoes': [C('Palmas'), (-26.8, -52.2), (-27.1, -52.5)],
    'sulistas_sudoeste': [(-27.1, -52.85), (-26.6, -52.95), C('Francisco Beltrão')],
    'sulistas_oeste': [(-27.1, -53.55), (-26.3, -53.55), (-25.5, -53.6), C('Toledo')],
    'paulistas_norte': [(-22.35, -49.3), (-22.8, -49.75), C('Jacarezinho')],
    'bandeiras': [(-23.45, -47.85), (-23.05, -49.3), (-22.75, -50.8), (-22.72, -51.95)],
    'mineiros_norte': [(-22.35, -49.9), (-22.9, -50.1), C('Tomazina')],
}
rt = {k: LineString(smooth(v)) for k, v in RT.items()}

# ---------- áreas especiais ----------
GUAIRA_POLY = Polygon([(lon, lat) for lat, lon in ([(-22.3, -50.98)] + TIBAGI[::-1][1:] + [(-25.2, -50.3), (-25.55, -50.75), (-26.0, -51.3)]
                                                  + IGUACU[13:] + [(-25.5, -55.1), (-22.3, -55.1)])])
guaira = state_poly.intersection(GUAIRA_POLY.buffer(0))
contestado = sc_geom.intersection(box(-54.0, LAT0, -49.75, -25.9)) if sc_geom else Polygon()
iguacu_t = unary_union([reg['oeste'], reg['sudoeste'], reg['palmas'], reg['guarapuava'].intersection(box(LON0, LAT0, -52.05, LAT1)),
                        sc_geom.intersection(box(LON0, LAT0, -51.85, LAT1)) if sc_geom else Polygon()]).buffer(0.003)
tord = LineString([P(-48.7, LAT1), P(-48.7, LAT0)])

# ---------- saída ----------
def js(o):
    return json.dumps(o, ensure_ascii=False, separators=(',', ':'))

reg_out = {}
for rid, (n, _) in REG.items():
    c = pt(*LAB[rid]) if rid in LAB else label_pt(reg[rid])
    reg_out[rid] = {'n': n, 'd': geom_d(reg[rid]), 'c': c}
out = {
    'W': W, 'H': H, 'pj': [LON0, LAT1, round(COS * K, 4), K],
    'reg': reg_out,
    'out': geom_d(state),
    'nb': [{'n': n, 'd': geom_d(g), 'c': pt(*NBLAB[n])} for n, g in nb],
    'riv': {k: {'n': RIVN[k], 'd': geom_d(g.simplify(0.01)), 'l': pt(*RIVLAB[k][:2]) + [RIVLAB[k][2]]} for k, g in riv.items()},
    'lake': geom_d(lake.simplify(0.005)),
    'rel': {k: {'n': RELN[k], 'd': geom_d(g), 'l': pt(*RELLAB[k][:2]) + [RELLAB[k][2]]} for k, g in rel.items()},
    'plan': {k: [n] + pt(la, lo) for k, (n, la, lo) in PLAN.items()},
    'city': city,
    'rt': {k: geom_d(g) for k, g in rt.items()},
    'area': {'guaira': geom_d(guaira.simplify(0.01)), 'contestado': geom_d(contestado.simplify(0.01)), 'iguacu': geom_d(iguacu_t.simplify(0.01))},
    'tord': 'M%s %sL%s %s' % (fmt(tord.coords[0][0]), fmt(tord.coords[0][1]), fmt(tord.coords[1][0]), fmt(tord.coords[1][1])),
}
with open(OUT, 'w', encoding='utf-8') as fh:
    fh.write('/* ===================== JORNADA DO PARANÁ: MAPA =====================\n')
    fh.write('   Gerado por tools/mapa_parana.py a partir das divisas municipais (IBGE, via geodata-br) e do Natural Earth.\n')
    fh.write('   Regiões = grupos de microrregiões. Iguaçu, Tibagi, relevo e caminhos são traçados aproximados. */\n')
    fh.write('const JN_GEO=' + js(out) + ';\n')
print('W,H', W, H, 'bytes', sum(len(js(v)) for v in out.values()))
for k, v in reg_out.items():
    print(k, len(v['d']))
