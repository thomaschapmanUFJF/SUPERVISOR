import pytest
from app.row import Row
from app.schema import JSON_SCHEMA, PAYLOAD_FIELDS


@pytest.fixture
def last_row():
    return Row(
        time=1000, latitude=-21.76, longitude=-43.35, altitude=850,
        apogeu=900, vel_vertical=12, qw=1.0, qx=0.0, qy=0.0, qz=0.0,
        accel_int=15, status=1, voltage_int=74, fix=1,
        pressure=950.2, rotation=0.0, accel_y=0.0,        
    )

def test_row_tem_altitude(last_row):
    assert last_row.altitude == 850

def test_row_e_instancia_de_row(last_row):
    assert isinstance(last_row, Row)

def test_altitude_esta_no_schema():
    assert "altitude" in JSON_SCHEMA

def test_payload_fields_bate_com_json_schema():
    assert PAYLOAD_FIELDS == list(JSON_SCHEMA.keys())
