








        var odiv=document.getElementById("thediv"); //获取div元素对象。
        var obt=document.getElementById("bt"); // 按钮
        var count=0;  //声明一个变量并赋初值为0，它用来存储间隔时间。
        var flag=null;  //声明一个变量并赋初值为null，此变量用来存储定时器函数的返回值。
        function done(){  // 此函数可以被定时器函数不断的调用，来对count进行递减。
            if(count==0){
                clearInterval(flag);
            }
            else{
                count=count-1;
            }
        }
        obt.onclick=function(){
            if(count==0){
                count=20;
                flag=setInterval(done,1000);
            }
            else{
                alert("还需要"+(count)+"秒才能点击");
            }
        }

