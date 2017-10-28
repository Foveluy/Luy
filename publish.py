import json
import os

file = open('./package.json','r')

try:
    all_the_text = file.read( )
    Dict = json.loads(all_the_text)
    
    version = Dict['version'].split('.')
    last = int(version[2]) + 1
    
    newVersion = version[0] + '.'+version[1]+'.'+ str(last)
    Dict['version'] = newVersion
    
    dumped = json.dumps(Dict)
    print('版本号升级为:',newVersion)
    write = open('./package.json','w')
    write.write(dumped)
    print('正在写入配置文件....')
    write.close()

finally:
    file.close( )

print('配置文件设置完毕，准备打包')

os.system('npm run build')
print('创建build完毕，准备发布')
os.system('npm publish')
    