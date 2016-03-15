'use strict';

measurementsApp.controller('ParserController',
    function ParserController($scope, unitsService)
    {
        $scope.helloMessage = "Units parser";
        $scope.source = "The road is 41 feet wide and 12.8 miles long. I jumped off the high dive (3 meters) into 15 feet of water. The pool has 3000 cubic meters of water, but my bathtub only holds 85 gallons and my water bottle is .500 liters.  \nThis paper is only 0.012 inches thick.";
        $scope.selectedSystem = "SI";

        var units = unitsService.units;

        var digitPattern = new RegExp(/((?:\d*\.)?\d+)/);
        var unitPattern = new RegExp("(" + unitsService.getUnitNames() + ")");
        var combined = new RegExp(digitPattern.source + "(?: |-)" + unitPattern.source, "g");
        console.log(combined.source);

        $scope.parsed = "";
        $scope.parseSource = function (src)
        {
            var count = 0;
            var priorIndex = 0;
            var results = [];
            var offset = 0;

            combined.lastIndex = 0;
            while (results.length == 0 || combined.lastIndex > 0)
            {
                priorIndex = combined.lastIndex;
                var match = combined.exec(src);
                if (match == null)
                    break;
                results[count] = src.substring(priorIndex - offset, combined.lastIndex - match[0].length);
                count++;

                var amount = match[1];//.match(digitPattern)[0];
                var precision = unitsService.inferPrecision(amount)
                //console.log("amount: " + amount + ", match: " + match[0]);
                //console.log(precision);

                var unitName = match[2];

                var selectedUnit;
                for (var i = 0; i < units.length; i++)
                    if (units[i].name == unitName)
                        selectedUnit = units[i];

                var temp = Math.max(precision + 1, 5);
                var normalized = (amount * selectedUnit.factor).toPrecision(temp);

                results[count] =
                    {
                        dimension: selectedUnit.dimension,
                        normalized: normalized,
                        precision: precision,
                        originalText: match[0]

                    };
                count++;
                combined.lastIndex++;
                offset = 1;
            }

            results[count] = src.substring(priorIndex - offset);

            $scope.parsed = JSON.stringify(results);
            return $scope.parsed;
        };

        $scope.render = function (selectedSystem)
        {
            var parsedSource = JSON.parse($scope.parsed);
            var output = "";
            //console.log(parsedSource.length);
            for (var item = 0; item < parsedSource.length; item++)
            {
                //console.log("about to process next item: " + item);
                if (typeof (parsedSource[item]) == 'string')
                {
                    //console.log("found a string");
                    output += parsedSource[item];
                }
                else
                {
                    //console.log("found an object");
                    output += $scope.getMeasurementString(parsedSource[item], selectedSystem);
                }
            }
            return output;
        }

        $scope.getMeasurementString = function (measurement, outputSystem)
        {
            var unitToUse = $scope.findUnitToUse(measurement, outputSystem);
            var num = new Number(new Number(measurement.normalized / unitToUse.factor).toPrecision(measurement.precision)).toLocaleString('en');
            console.log(num);
            return num + " " + unitToUse.name;
        }

        $scope.findUnitToUse = function (measurement, outputSystem)
        {
            var unitToUse;
            for (var i = 0; i < units.length; i++)
            {
                if (measurement.dimension != units[i].dimension || outputSystem != units[i].system || !units[i].allowedForOutput)
                    continue;

                if (unitToUse == null)
                {
                    unitToUse = units[i];
                }
                else
                {
                    var temp = measurement.normalized / units[i].factor;
                    //console.log("temp: " + temp);
                    if (temp < 1)
                        return unitToUse;
                    unitToUse = units[i];
                }
            }
            return unitToUse;
        }

    }
);
