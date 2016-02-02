measurementsApp.factory('unitsService', function () {
    return {
        units: [
            /* Length units */
                {
                    name: "inches",
                    dimension: "length",
                    system: "C",
                    allowedForOutput: true,
                    factor: .0254
                },
                {
                    name: "feet",
                    dimension: "length",
                    system: "C",
                    allowedForOutput: true,
                    factor: 0.3048
                },
                {
                    name: "foot",
                    dimension: "length",
                    system: "C",
                    allowedForOutput: false,
                    factor: 0.3048
                },
                {
                    name: "yards",
                    dimension: "length",
                    system: "C",
                    allowedForOutput: false,
                    factor: 0.3048 * 3
                },
                {
                    name: "miles",
                    dimension: "length",
                    system: "C",
                    allowedForOutput: true,
                    factor: 0.3048 * 5280
                },
                {
                    name: "millimeters",
                    dimension: "length",
                    system: "SI",
                    allowedForOutput: true,
                    factor: 0.001
                },
                {
                    name: "centimeters",
                    dimension: "length",
                    system: "SI",
                    allowedForOutput: false,
                    factor: 0.001
                },
                {
                    name: "meters",
                    dimension: "length",
                    system: "SI",
                    allowedForOutput: true,
                    factor: 1
                },
                {
                    name: "meter",
                    dimension: "length",
                    system: "SI",
                    allowedForOutput: false,
                    factor: 1
                },
                {
                    name: "kilometers",
                    dimension: "length",
                    system: "SI",
                    allowedForOutput: true,
                    factor: 1000
                },
                /* Volume units */
                {
                    name: "milliliters",
                    dimension: "volume",
                    system: "SI",
                    allowedForOutput: true,
                    factor: .001
                },
                {
                    name: "liters",
                    dimension: "volume",
                    system: "SI",
                    allowedForOutput: true,
                    factor: 1
                },
                {
                    name: "cubic meters",
                    dimension: "volume",
                    system: "SI",
                    allowedForOutput: true,
                    factor: 1000
                },
                {
                    name: "fluid ounces",
                    dimension: "volume",
                    system: "C",
                    allowedForOutput: true,
                    factor: 0.0295735
                },
                {
                    name: "gallons",
                    dimension: "volume",
                    system: "C",
                    allowedForOutput: true,
                    factor: 3.78541
                }

        ],
        getUnitNames: function () {
            var unitNames = "";
            for (var i = 0; i < this.units.length; i++) {
                unitNames += "|" + this.units[i].name;
            }
            return unitNames.substring(1);
        },
        inferPrecision: function (amount) {
            var precision;
            if (amount.match(/\./))
                precision = amount.replace(/^0*/, '').replace(/\./, '').replace(/^0*/, '').length;
            else
                precision = amount.replace(/^0*/, '').replace(/0*$/, '').length;
            if (precision < 2)
                precision = 2;
            return precision;
        }

    }
});