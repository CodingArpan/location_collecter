import mongoose from 'mongoose';
const { Schema } = mongoose;

const Dailylocationschema = new Schema({

    date: {
        type: String,
        default: `${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()}`,
    },
    time: {
        type: String,
        default: new Date().toLocaleString("en-US", { timeZone: 'Asia/Kolkata', timeStyle: 'medium', hourCycle: 'h12' }).toString(),
    },
    latitude: {
        type: String,
        required: true,
        trim: true,
        maxLength: [15, 'Latitude Must Be Within 200 characters'],

    },
    longitude: {
        type: String,
        required: true,
        trim: true,
        maxLength: [15, 'Longitude Must Be Within 200 characters'],

    },
    locationaccuracy: {
        type: String,
        required: true,
        trim: true,
        maxLength: [30, 'Accuracy Must Be Within 200 characters'],

    },
    purpose: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minLength: [5, 'Purpose Must Be Atleast 5 characters Long'],
        maxLength: [200, 'Purpose Must Be Within 200 characters'],

    },
    message: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minLength: [5, 'Message Must Be Atleast 5 characters Long'],
        maxLength: [500, 'Message Must Be Within 500 characters'],


    },
    userid: {
        type: String,
        required: true,
        minLength: [5, 'ID Number Must Be 5 Digit Long'],
        maxLength: [5, 'ID Number Must Be 5 Digit Long'],
    },
    name: {
        type: String,
        lowercase: true,
        required: true,
        minLength: [5, 'Name Must Be Atleast 5 characters Long'],
        maxLength: [100, 'Name Must Be Within 100 characters'],
        trim: true,
    },
    position: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        enum: { values:['corporate', 'representative', 'regional_manager', 'manager'], message: '{VALUE} is not supported' },
    },
    verifyby:{
        type:[String],
        trim: true,
        maxLength: [100, 'Verifier Name Must Be Within 200 characters'],

    },
    

},{ timestamps: true })

const DailyLocationmodel = mongoose.model('locationdb', Dailylocationschema);
export default DailyLocationmodel;