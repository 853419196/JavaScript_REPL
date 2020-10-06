function require(filename)
{
    let module=require.cache[filename];
    if(module==null)
    {
        module=require.cache[filename]={exports:{}};
        try
        {
            Function("exports","module",read(filename)).call(module.exports,module.exports,module);
        }
        catch(error)
        {
            delete require.cache[filename];
            throw error;
        }
    }
    return module.exports;
}
require.cache=Object.create(null);