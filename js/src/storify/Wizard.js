var helper = require('./Helper.js')().get();

module.exports = Wizard;

function Wizard(title, steps, endCallback) {
    if (!(this instanceof Wizard)) return new Wizard(steps);
    this.title = title;
    this.steps = [];
    this.endCallback = endCallback;
    this.current = 0;
    this.Step = Step;
    this.getHelper = function(obj) {
        return new FormHelper(obj);
    };
    this.context = {};
    for (var i = 0; i < steps.length; i++) {
        this.steps.push(new this.Step(steps[i].data, steps[i].callback, steps[i].first, steps[i].last));
    }
    return this;
}
Wizard.prototype.show = function() {
    /*
        create the div, 
        append it to the body,
        return it for further manipolation
    */
};
Wizard.prototype.start = function() {
    this.current = 0;
    this.context = {};
    this.context.wizard = this;
    this.steps[this.current].go(this.context);
};
Wizard.prototype.next = function() {
    this.current++;
    this.steps[this.current].go(this.context);
};
Wizard.prototype.previous = function() {
    if (this.current === 0) return;
    this.context = this.steps[this.current].snapshot;
    this.current--;
    this.steps[this.current].go(this.context); // go(this.context) to save context also on previous ;
};
Wizard.prototype.reload = function() {
    this.steps[this.current].go(this.steps[this.current].getSnapshot());
};
Wizard.prototype.exit = function() {
    if (this.endCallback)
        this.endCallback(this.context);
};

function Step(_data, _cb, first, last) { //wraps a step of the wizard
    if (!(this instanceof Step)) return new Step(_cb);
    this.snapshot = {};
    this.data = _data;
    this.callback = _cb;
    this.last = last || false;
    this.first = first || false;
    return this;
}
Step.prototype.go = function(_context) { // <-- context comes from wizard
    var context = _context;
    this.snapshot = helper.deepCopy(context); // <-- save the context for rollback
    var self = this;
    var confirmButtonText = "next >>";
    if (self.last) {
        confirmButtonText = "done!";
    }
    setTimeout(
        function() {
            swwi({
                    title: context.wizard.title + "(" + (context.wizard.current + 1) + "/" + context.wizard.steps.length + ")",
                    text: self.data.text,
                    type: "info" || self.data.type,
                    showCancelButton: !self.first,
                    confirmButtonText: confirmButtonText,
                    closeOnConfirm: true
                }, function(isConfirm) {
                    context.calls = context.calls || 0;
                    context.calls++;
                    if (isConfirm) {
                        if (self.last) {
                            context.wizard.exit();
                        } else {
                            context.wizard.next();
                        }
                    } else {
                        context.wizard.previous();
                    }
                },
                function(handler) {
                    $(handler).html(''); //reset the custom div
                    self.callback(handler, context); // <-- pass context to the inner function of the step. 
                });
        }, 1000);


};
Step.prototype.getSnapshot = function(context) {
    return helper.deepCopy(this.snapshot); //<--return 
};


function FormHelper(handler) {
    if (!(this instanceof FormHelper)) return new FormHelper(handler);
    this.handler = handler;
    this.$form = $(document.createElement('form'));
    this.$handler = $(this.handler);
    this.$handler.append(this.$form);
    this.fields = [];
    return this;
}
FormHelper.prototype.focus = function() {
	this.fields[0].focus();
};

FormHelper.prototype.addField = function(label, value, field, onChange) {
    var _label = $(document.createElement('label')).html(label);
    this.$form.append(_label);
    this.$form.append(field);
    this.$form.append('<br>');
    this.fields.push(field);
    if (value) field.val(value);
    return this;
};

FormHelper.prototype.addTextField = function(label, value, onChange) {
    var _input = $(document.createElement('input')).attr('type', 'text').change(function() {
        onChange(_input.val());
    });
    return this.addField(label, value, _input, onChange);
};

FormHelper.prototype.addSelect = function(label, value, data, onChange) {
    var s = $('<select />');
    for (var val in data) {
        $('<option />', {
            value: val,
            text: data[val]
        }).appendTo(s);
    }
    s.change(function() {
        onChange(s.val());
    });    
    return this.addField(label, value, s, onChange);
};

FormHelper.prototype.addDateField = function(label, value, onChange) {
    var _input = $(document.createElement('input')).attr('type', 'text').change(function() {
        onChange(_input.val());
    });
    _input.datepicker();
    return this.addField(label, value, _input, onChange);
};
