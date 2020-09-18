const path = require('path')
const args = process.argv.slice(2);
let filename = args[0];
try {
    filename = filename && (filename.replace(/\.js\s*$/,'') +'.js' );
    require(path.join(__dirname,filename)).run();
} catch (err) {
    console.log('Oh !!! catch you >>> '+err.message);
}

// int BinSearch(SeqList *R，int n,KeyType K)
// {
//     //在有序表R[0..n-1]中进行二分查找，成功时返回结点的位置，失败时返回-1
//     int low=0,high=n-1,mid；     //置当前查找区间上、下界的初值
//     while(low<=high)
//     {
//         if(R[low].key==K)
//             return low;
//         if(R[high].key==k)
//             return high;          //当前查找区间R[low..high]非空
//         mid=low+(high-low)/2;
//             /*使用(low+high)/2会有整数溢出的问题
//             （问题会出现在当low+high的结果大于表达式结果类型所能表示的最大值时，
//                 这样，产生溢出后再/2是不会产生正确结果的，而low+((high-low)/2)
//                 不存在这个问题*/
//         if(R[mid].key==K)
//           return mid;             //查找成功返回
//         if(R[mid].key<K)
//           low=mid+1;              //继续在R[mid+1..high]中查找
//         else
//           high=mid-1;             //继续在R[low..mid-1]中查找
//     }
//     if(low>high)
//         return -1;//当low>high时表示所查找区间内没有结果，查找失败
// }