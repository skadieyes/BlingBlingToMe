# blingbling

# what
>  这是一个音频可视化的小玩意儿
>  it's just a littel ting about the Audio visualization

>  :heart:  [LiveDemo](https://skadieyes.github.io/blingblingBuild/index.html#/audio)

## 截图
![alt text](https://skadieyes.github.io/BlingBlingToMe/assets/projectImg.png "截图")

## 什么是音频可视化/the means of AudioVisualization
使用h5提供的Web Audio API，获取音频把音频解码，然后获取频率及时间域分析的信息，使用canvas将其绘制和表达出来
Use the Web Audio Api provided by H5, Get audio uploaded by the user and then decode the audio, draw it by using canvas

## 怎么进行音频可视化/How to do
#### 通过用户上传，或者向服务端请求，获取一个音频文件
##### Get audio files uploaded by the user or from the server
#### 创建音频的上下文环境AudioContext，创建可以用来播放音乐的AudioBufferSourceNode
#### 通过decodeAudioData解码音频，获得一个ArrayBuffer类型的数据
#### 使用AudioBufferSourceNode播放ArrayBuffer, 实现播放音频数据
#### 创建createAnalyser, 用来提供实时的频率及时间域分析的信息
#### 把AudioBufferSourceNode和Analyser连接起来，实现对正在播放的音乐的实时频率分析
#### AnalyserNode.getByteTimeDomainData()方法用于获取音频时域数据, AnalyserNode.getByteFrequencyData()方法用于获取音频频域数据。
#### 获取音频分析数据后, 使用Canvas或者一切你喜欢的方式将它表示出来

## npm 相关命令

``` bash
# 安装工程依赖
npm install

# 在本地启动调试 server
npm run dev

# 构建线上生产环境产物
npm run build

# 启动编译后的代码，注意，需要在 dist 目录中启动，仅 SSR 模式下有效
npm run start

# 检查代码是否符合规范
npm run lint
```




