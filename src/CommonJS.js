function require(filename)
{
    const module={exports:{}};
    Function("exports","module",read(filename)).call(module.exports,module.exports,module);
    return module.exports;
}