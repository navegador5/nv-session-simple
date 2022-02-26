const is_str   = (s)=>typeof(s) === 'string';
const is_regex = (o)=>(o instanceof RegExp);



module.exports = {
    is_str,
    is_regex
}
