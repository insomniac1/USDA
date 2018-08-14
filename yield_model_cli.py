import pickle
import numpy
from xgboost import XGBRegressor
import argparse
import sys

# Parse CLI arguments
parser = argparse.ArgumentParser(description='Generate crop yield estimates.')
parser.add_argument('--longitude', '-x', metavar='N', type=float, nargs=1,
                    help='Longitude in meters.')
parser.add_argument('--latitude', '-y', metavar='N', type=float, nargs=1,
                    help='Latitude in meters.')
parser.add_argument('--soilquality', '-q', metavar='N', type=float, nargs=1,
                    help='Value from 0 (bad) to 1 (good) for soil quality. (aka nccpi2cs)')
parser.add_argument('--soilcarbon', '-c', metavar='N', type=float, nargs=1,
                    help='')
parser.add_argument('--wateravailability', '-w', metavar='N', type=float, nargs=1,
                    help='')
parser.add_argument('--date', '-d', metavar='N', type=int, nargs=1,
                    help='The year for which the estimate should be given.')
parser.add_argument('--cropquality', '-C', metavar='N', type=float, nargs=115,
                    help='115 floats representing the percentage of crops in "Excellent", "Good", "Fair", "Poor", or "Very Poor" condition for the 23 weeks of the growing season. If using this variable with some blank values, replaces the blank values with -2')
parser.add_argument('--vegetation', '-v', metavar='N', type=int, nargs=20,
                    help='20 floats for the vegetation over 20 8-day periods in the growin season. Replace blank values with -2.')
parser.add_argument('--temperature', '-t', metavar='N', type=int, nargs=20,
                    help='20 floats for the temperature over 20 8-day periods in the growing season. Replace blank values with -2.')
args = parser.parse_args()

# Load pickled model
model_file = open("pickledstring_USDA_model", "rb") # Replace url with location of pickled file
model = pickle.load(model_file, encoding='latin1')

# Place CLI arguments in numpy array

vars = []

if args.longitude:
    vars.append(float(args.longitude[0]))
else:
    vars.append(numpy.nan)
if args.latitude:
    vars.append(float(args.latitude[0]))
else:
    vars.append(numpy.nan)
if args.soilquality:
    vars.append(float(args.soilquality[0]))
else:
    vars.append(numpy.nan)
if args.soilcarbon:
    vars.append(float(args.soilcarbon[0]))
else:
    vars.append(numpy.nan)
if args.wateravailability:
    vars.append(float(args.wateravailability[0]))
else:
    vars.append(numpy.nan)
if args.date:
    vars.append(int(args.date[0]))
else:
    vars.append(numpy.nan)
if args.cropquality:
    for q in args.cropquality:
        q = float(q)
        if q == -2:
            q = numpy.nan
        vars.append(q)
else:
    for week in range(0, 115):
        vars.append(numpy.nan)
if args.vegetation:
    for v in args.vegetation:
        v = float(v)
        if v == -2:
            v = numpy.nan
        vars.append(v)
else:
    for period in range(0, 21):
        vars.append(numpy.nan)
if args.temperature:
    for t in args.temperature:
        t = float(t)
        if t == -2:
            t = numpy.nan
        vars.append(t)
else:
    for period in range(0, 21):
        vars.append(numpy.nan)

model_input = numpy.asarray([vars])

# Generate estimate
print(model.predict(model_input)[0])
sys.stdout.flush()
