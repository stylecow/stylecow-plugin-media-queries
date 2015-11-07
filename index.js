"use strict";

module.exports = function (tasks, stylecow) {

    tasks.addTask({
        filter: 'ConditionalFeatureRange',
        fn: function (range) {
            let expression = range.getParent();

            range
                .getChildren('Comparator')
                .forEach(function (comparator, index) {
                    if (index !== 0) {
                        expression.before((new stylecow.Keyword()).setName('and'));
                    }

                    let exp = new stylecow.ConditionalExpression();
                    exp.push(resolve(comparator));
                    expression.before(exp);
                });

            let p = range.getParent();
            expression.detach();
        }
    });

    function resolve (comparator) {
        let value   = new stylecow.Value(),
            feature = new stylecow.ConditionalFeature(),
            comp    = comparator.name,
            unit    = comparator.next();

        if (comparator.prev().is('Keyword')) {
            feature.setNameWithVendor(comparator.prev().name);
        }
        // (10px > width) => (width < 10px)
        else {
            unit = comparator.prev();
            feature.setNameWithVendor(comparator.next().name);

            if (comp.indexOf('<') !== -1) {
                comp = comp.replace('<', '>');
            } else if (comp.indexOf('>') !== -1) {
                comp = comp.replace('>', '<');
            }
        }

        feature.push(value);
        value.push(unit);

        switch (comp) {
            case '<=':
                return feature.setName('max-' + feature.name);

            case '>=':
                return feature.setName('min-' + feature.name);

            case '<':
                unitStep(unit, -0.001);
                return feature.setName('max-' + feature.name);

            case '>':
                unitStep(unit, 0.001);
                return feature.setName('min-' + feature.name);

            default:
                tasks.log('Error in the media query comparator', comparator);
        }
    }

    function unitStep(unit, amount) {
        if (unit.is('Number')) {
            return unit.name += amount;
        }

        if (unit.is('Unit')) {
            return unit.get('Number').name += amount;
        }

        if (unit.is('Ratio')) {
            return unit.getAll('Number')[1].name += amount;
        }
    }
};