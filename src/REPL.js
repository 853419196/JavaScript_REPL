"use strict";
let _,_error,global=this,repl={};
repl.__nonSpaceRegExp__=/\S/;
repl.__commandRegExp__=/^\.[^.\d]?$/;
function __evalFunction__(evalString)
{
    if(evalString)
    {
        const localNumber=evalString.search(repl.__nonSpaceRegExp__);
        if(repl.__commandRegExp__.test(evalString.slice(localNumber,localNumber+2)))switch(evalString.slice(localNumber).trimRight())
        {
            case ".editor":
            {
                repl.__editorBoolean__=true;
                repl.__inputStringArray__=[];
                print("// Entering editor mode. (Enter a blank line to exit)");
                break;
            }
            case ".exit":
            {
                repl.__inputString__=null;
                break;
            }
            case ".help":
            {
                print("Console Command:");
                print(".editor   Enter editor mode.");
                print(".exit     Exit the REPL.");
                print(".help     Print this help message.");
                print("----------------------------------");
                print("JavaScript Variable:");
                print("_         Last evaluated result.");
                print("_error    Last thrown error.");
                print("global    Global object.");
                print("----------------------------------");
                print("JavaScript Function:");
                print("print     Output function.");
                print("readline  Input function.");
                break;
            }
            default:
            {
                print("Invalid REPL keyword.");
            }
        }
        else try
        {
            _=global.eval(evalString);
            repl.__output__(_);
        }
        catch(caught)
        {
            try
            {
                _error=caught;
                repl.__output__(_error,true);
            }
            catch(error)
            {
                print("Uncaught "+repl.__toString__(error));
            }
        }
    }
}
repl.__toString__=function(any)
{
    return typeof any=="function"||typeof any=="object"&&any?typeof any.valueOf=="function"||typeof any.toString=="function"?""+any:Object.prototype.toString.call(any):String(any);
};
repl.__output__=function(output,throwBoolean)
{
    switch(typeof output)
    {
        case "bigint":
        {
            const out=String(output)+"n";
            print(throwBoolean?"Uncaught "+out:"< "+out);
            break;
        }
        case "boolean":
        {
            const out=String(output);
            print(throwBoolean?"Uncaught "+out:"< "+out);
            break;
        }
        case "function":
        {
            const out="["+Object.prototype.toString.call(output).slice(8,-1)+(output.name?": "+repl.__toString__(output.name)+"]":" (anonymous)]");
            print(throwBoolean?"Uncaught "+out:"< "+out);
            break;
        }
        case "number":
        {
            const out=String(output);
            print(throwBoolean?"Uncaught "+out:"< "+out);
            break;
        }
        case "object":
        {
            switch(Object.prototype.toString.call(output))
            {
                case "[object BigInt]":
                {
                    const out="[BigInt: "+String(output.valueOf())+"n]";
                    print(throwBoolean?"Uncaught "+out:"< "+out);
                    break;
                }
                case "[object Boolean]":
                {
                    const out="[Boolean: "+String(output.valueOf())+"]";
                    print(throwBoolean?"Uncaught "+out:"< "+out);
                    break;
                }
                case "[object Date]":
                {
                    const out=isNaN(output)?String(output):repl.__toString__(output.toJSON());
                    print(throwBoolean?"Uncaught "+out:"< "+out);
                    break;
                }
                case "[object Error]":
                {
                    const out=repl.__toString__(output);
                    if(throwBoolean)print("Uncaught "+out);
                    else
                    {
                        let stackString=repl.__toString__(output.stack),startNumber=0,endNumber=stackString.length;
                        while(true)
                        {
                            if(stackString.slice(startNumber,startNumber+out.length)==out)
                            {
                                if(stackString[startNumber+out.length]=="\n")startNumber+=out.length+1;
                                else
                                {
                                    if(stackString[startNumber+out.length])while(stackString[startNumber]=="\n")startNumber++;
                                    else startNumber=endNumber;
                                    break;
                                }
                            }
                            else if(stackString[startNumber]=="\n")startNumber++;
                            else break;
                        }
                        while(stackString[endNumber-1]=="\n"&&startNumber<endNumber)endNumber--;
                        stackString=stackString.slice(startNumber,endNumber);
                        print("< "+out.replace(/\n/g,"\n. "));
                        if(stackString)print(". "+stackString.replace(/\n/g,"\n. "));
                    }
                    break;
                }
                case "[object Null]":
                {
                    const out=String(output);
                    print(throwBoolean?"Uncaught "+out:"< "+out);
                    break;
                }
                case "[object Number]":
                {
                    const out="[Number: "+String(output.valueOf())+"]";
                    print(throwBoolean?"Uncaught "+out:"< "+out);
                    break;
                }
                case "[object RegExp]":
                {
                    const out=repl.__toString__(output);
                    print(throwBoolean?"Uncaught "+out:"< "+out);
                    break;
                }
                case "[object String]":
                {
                    let out=JSON.stringify(output.valueOf());
                    if(output.valueOf().slice(0,-1).indexOf("\n")<0)
                    {
                        out="[String: "+out+"]";
                        print(throwBoolean?"Uncaught "+out:"< "+out);
                    }
                    else
                    {
                        out="[String: "+out[0]+"\\\n"+out.slice(1,-2).replace(/(?:^|\b|[^\\])(?:\\\\)*\\n/g,"$&\\\n")+out.slice(-2)+"]";
                        if(throwBoolean)
                        {
                            print("Uncaught:");
                            print(out);
                        }
                        else print("< "+out.replace(/\n/g,"\n. "));
                    }
                    break;
                }
                case "[object Symbol]":
                {
                    const out="[Symbol: "+String(output.valueOf())+"]";
                    if(out.indexOf("\n")>=0)
                    {
                        if(throwBoolean)
                        {
                            print("Uncaught:");
                            print(out);
                        }
                        else print("< "+out.replace(/\n/g,"\n. "));
                    }
                    else print(throwBoolean?"Uncaught "+out:"< "+out);
                    break;
                }
                default:
                {
                    let constructorNameString=output.constructor&&output.constructor.name?repl.__toString__(output.constructor.name):"Object",out=JSON.stringify(output,function(key,value)
                    {
                        switch(typeof value)
                        {
                            case "bigint":
                            {
                                return String(value)+"n";
                            }
                            case "function":
                            {
                                return "["+Object.prototype.toString.call(value).slice(8,-1)+(value.name?": "+repl.__toString__(value.name)+"]":" (anonymous)]");
                            }
                            case "number":
                            {
                                return isFinite(value)?value:String(value);
                            }
                            case "object":
                            {
                                return value==output&&key?"[Circular]":value;
                            }
                            case "symbol":
                            {
                                return String(value);
                            }
                            case "undefined":
                            {
                                return String(value);
                            }
                            default:
                            {
                                return value;
                            }
                        }
                    },4),toStringTagString=Object.prototype.toString.call(output).slice(8,-1);
                    out=constructorNameString+(constructorNameString==toStringTagString?" ":" ["+toStringTagString+"] ")+out;
                    if(out.indexOf("\n")>=0)
                    {
                        if(throwBoolean)
                        {
                            print("Uncaught:");
                            print(out);
                        }
                        else print("< "+out.replace(/\n/g,"\n. "));
                    }
                    else print(throwBoolean?"Uncaught "+out:"< "+out);
                }
            }
            break;
        }
        case "string":
        {
            let out=JSON.stringify(output);
            if(output.slice(0,-1).indexOf("\n")<0)print(throwBoolean?"Uncaught "+out:"< "+out);
            else
            {
                out=out.slice(0,-2).replace(/(?:\b|[^\\])(?:\\\\)*\\n/g,"$&\\\n")+out.slice(-2);
                if(throwBoolean)
                {
                    print("Uncaught:");
                    print(out);
                }
                else print("< "+out.replace(/\n/g,"\n. "));
            }
            break;
        }
        case "symbol":
        {
            const out=String(output);
            if(out.indexOf("\n")>=0)
            {
                if(throwBoolean)
                {
                    print("Uncaught:");
                    print(out);
                }
                else print("< "+out.replace(/\n/g,"\n. "));
            }
            else print(throwBoolean?"Uncaught "+out:"< "+out);
            break;
        }
        case "undefined":
        {
            const out=String(output);
            print(throwBoolean?"Uncaught "+out:"< "+out);
            break;
        }
    }
};
print("Welcome to JavaScript REPL.");
print('Type ".help" for more information.');
do
{
    repl.__inputString__=readline();
    if(!repl.__editorBoolean__)__evalFunction__(repl.__inputString__);
    else
    {
        if(repl.__inputString__)repl.__inputStringArray__.push(repl.__inputString__);
        else
        {
            repl.__editorBoolean__=false;
            print("// Exiting editor mode.");
            __evalFunction__(repl.__inputStringArray__.join("\n"));
        }
    }
}
while(repl.__inputString__!=null);
print("// REPL was exited.");