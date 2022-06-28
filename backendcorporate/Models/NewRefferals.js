import mongoose from 'mongoose';
const { Schema } = mongoose;
const RefferalSchema = new Schema({
    date: {
        type: String,
        default: `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`,
    },
    time: {
        type: String,
        default: new Date().toLocaleString("en-US", { timeZone: 'Asia/Kolkata', timeStyle: 'medium', hourCycle: 'h12' }).toString(),
    },
    issuerid: {
        type: String,
        required: true,
        minLength: [5, 'ID Number Must Be 5 Digit Long'],
        maxLength: [5, 'ID Number Must Be 5 Digit Long'],
    },
    recipentname: {
        type: String,
        lowercase: true,
        required: true,
        minLength: [5, 'Name Must Be Atleast 5 characters Long'],
        maxLength: [100, 'Name Must Be Within 100 characters'],
        trim: true,
    },
    recipentemail: {
        type: String,
        required: true,
        minLength: [5, 'Email Must Be Atleast 5 characters Long'],
        maxLength: [100, 'Email Must Be Within 100 characters'],
        lowercase: true,
        trim: true,
        unique: true,
    },
    recipentrefferalid: {
        type: String,
        required: true,
        minLength: [5, 'Mobile Number Must Be 10 Digit Long'],
        maxLength: [5, 'Mobile Number Must Be 10 Digit Long'],
        unique: true,
    },
    recipenttype: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        enum: { values: ['corporate', 'representative', 'regional_manager', 'manager'], message: '{VALUE} is not supported' },
    },
    status: {
        type: Boolean,
        required: true,

    }

},{ timestamps: true })

const RefferalModel = mongoose.model('Refferal', RefferalSchema);

export default RefferalModel;

