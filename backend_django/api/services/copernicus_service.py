import cdsapi
import xarray as xr
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os
from django.conf import settings
import tempfile

class CopernicusService:
    def __init__(self):
        # Initialize the CDS API client
        self.client = cdsapi.Client(
            url=settings.COPERNICUS_API_URL,
            key=settings.COPERNICUS_API_KEY
        )
        
        # Define dataset mappings
        self.datasets = {
            'climate': 'reanalysis-era5-single-levels',
            'air_quality': 'cams-global-atmospheric-composition-forecasts',
            'vegetation': 'satellite-land-surface',
            'solar': 'cams-solar-radiation',
            'elevation': 'copernicus-dem'
        }
        
        # Cache directory for temporary files
        self.cache_dir = tempfile.mkdtemp()

    def get_location_data(self, latitude: float, longitude: float) -> dict:
        """
        Get comprehensive environmental data for a specific location
        """
        # Define area around the point (0.1 degree buffer)
        area = [
            latitude + 0.1, longitude - 0.1,  # North, West
            latitude - 0.1, longitude + 0.1   # South, East
        ]
        
        try:
            # Get climate data
            climate_data = self._get_climate_data(area)
            
            # Get air quality data
            air_quality_data = self._get_air_quality_data(area)
            
            # Get vegetation data
            vegetation_data = self._get_vegetation_data(area)
            
            # Get solar radiation data
            solar_data = self._get_solar_data(area)
            
            # Combine all data
            return {
                # Climate metrics
                'temperature': climate_data.get('temperature', 20.0),  # °C
                'humidity': climate_data.get('humidity', 50.0),  # %
                'air_pressure': climate_data.get('pressure', 1013.25),  # hPa
                'precipitation': climate_data.get('precipitation', 0.0),  # mm
                
                # Air quality metrics
                'air_quality': air_quality_data.get('air_quality_index', 50.0),
                'pm25': air_quality_data.get('pm25', 10.0),  # μg/m³
                'pm10': air_quality_data.get('pm10', 20.0),  # μg/m³
                'o3': air_quality_data.get('o3', 40.0),  # ppb
                'no2': air_quality_data.get('no2', 20.0),  # ppb
                
                # Environmental metrics
                'green_space_ratio': vegetation_data.get('ndvi', 0.5),
                'sunshine_hours': solar_data.get('sunshine_hours', 7.0),
                'uv_index': solar_data.get('uv_index', 4.0)
            }
        except Exception as e:
            # Log the error and return default values
            print(f"Error fetching Copernicus data: {str(e)}")
            return self._get_default_values()

    def _get_climate_data(self, area: list) -> dict:
        """
        Retrieve temperature, humidity, and pressure data
        """
        try:
            # Download data
            filename = os.path.join(self.cache_dir, 'climate.nc')
            self.client.retrieve(
                self.datasets['climate'],
                {
                    'product_type': 'reanalysis',
                    'variable': [
                        '2m_temperature',
                        '2m_dewpoint_temperature',
                        'surface_pressure',
                        'total_precipitation'
                    ],
                    'year': datetime.now().strftime('%Y'),
                    'month': datetime.now().strftime('%m'),
                    'day': datetime.now().strftime('%d'),
                    'time': [datetime.now().strftime('%H:00')],
                    'area': area,
                    'format': 'netcdf'
                },
                filename
            )
            
            # Process data
            ds = xr.open_dataset(filename)
            df = ds.to_dataframe().mean()
            
            return {
                'temperature': float(df['2m_temperature'] - 273.15),  # K to °C
                'humidity': self._calculate_humidity(
                    float(df['2m_temperature']),
                    float(df['2m_dewpoint_temperature'])
                ),
                'pressure': float(df['surface_pressure'] / 100),  # Pa to hPa
                'precipitation': float(df['total_precipitation'] * 1000)  # m to mm
            }
        except Exception as e:
            print(f"Error in climate data retrieval: {str(e)}")
            return {}

    def _get_air_quality_data(self, area: list) -> dict:
        """
        Retrieve air quality data
        """
        try:
            filename = os.path.join(self.cache_dir, 'air_quality.nc')
            self.client.retrieve(
                self.datasets['air_quality'],
                {
                    'variable': [
                        'particulate_matter_10um',
                        'particulate_matter_2.5um',
                        'ozone',
                        'nitrogen_dioxide'
                    ],
                    'time': datetime.now().strftime('%Y-%m-%d'),
                    'area': area,
                    'format': 'netcdf'
                },
                filename
            )
            
            ds = xr.open_dataset(filename)
            df = ds.to_dataframe().mean()
            
            # Calculate AQI based on EPA standards
            return {
                'pm10': float(df['particulate_matter_10um']),
                'pm25': float(df['particulate_matter_2.5um']),
                'o3': float(df['ozone']),
                'no2': float(df['nitrogen_dioxide']),
                'air_quality_index': self._calculate_aqi(df)
            }
        except Exception as e:
            print(f"Error in air quality data retrieval: {str(e)}")
            return {}

    def _get_vegetation_data(self, area: list) -> dict:
        """
        Retrieve vegetation (NDVI) data
        """
        try:
            filename = os.path.join(self.cache_dir, 'vegetation.nc')
            self.client.retrieve(
                self.datasets['vegetation'],
                {
                    'variable': 'normalized_difference_vegetation_index',
                    'time': datetime.now().strftime('%Y-%m-%d'),
                    'area': area,
                    'format': 'netcdf'
                },
                filename
            )
            
            ds = xr.open_dataset(filename)
            ndvi = float(ds['ndvi'].mean())
            
            return {
                'ndvi': max(0, min(1, ndvi))  # Normalize to 0-1
            }
        except Exception as e:
            print(f"Error in vegetation data retrieval: {str(e)}")
            return {}

    def _get_solar_data(self, area: list) -> dict:
        """
        Retrieve solar radiation data
        """
        try:
            filename = os.path.join(self.cache_dir, 'solar.nc')
            self.client.retrieve(
                self.datasets['solar'],
                {
                    'variable': [
                        'surface_solar_radiation_downwards',
                        'uv_index'
                    ],
                    'time': datetime.now().strftime('%Y-%m-%d'),
                    'area': area,
                    'format': 'netcdf'
                },
                filename
            )
            
            ds = xr.open_dataset(filename)
            df = ds.to_dataframe().mean()
            
            return {
                'sunshine_hours': self._calculate_sunshine_hours(df),
                'uv_index': float(df['uv_index'])
            }
        except Exception as e:
            print(f"Error in solar data retrieval: {str(e)}")
            return {}

    def _calculate_humidity(self, t: float, td: float) -> float:
        """Calculate relative humidity from temperature and dewpoint"""
        return 100 * (np.exp((17.625 * td) / (243.04 + td)) / 
                     np.exp((17.625 * t) / (243.04 + t)))

    def _calculate_aqi(self, data: pd.Series) -> float:
        """Calculate Air Quality Index based on EPA standards"""
        # Simplified AQI calculation
        pm25_aqi = data['particulate_matter_2.5um'] * 4.0
        pm10_aqi = data['particulate_matter_10um'] * 2.0
        o3_aqi = data['ozone'] * 0.5
        no2_aqi = data['nitrogen_dioxide'] * 0.5
        
        return max(pm25_aqi, pm10_aqi, o3_aqi, no2_aqi)

    def _calculate_sunshine_hours(self, data: pd.Series) -> float:
        """Calculate sunshine hours from solar radiation"""
        # Simplified calculation
        return min(12, data['surface_solar_radiation_downwards'] / 3600000)

    def _get_default_values(self) -> dict:
        """Return default values when API fails"""
        return {
            'temperature': 20.0,
            'humidity': 50.0,
            'air_pressure': 1013.25,
            'precipitation': 0.0,
            'air_quality': 50.0,
            'pm25': 10.0,
            'pm10': 20.0,
            'o3': 40.0,
            'no2': 20.0,
            'green_space_ratio': 0.5,
            'sunshine_hours': 7.0,
            'uv_index': 4.0
        } 