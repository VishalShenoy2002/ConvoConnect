import os
from threading import Thread

def runServer():
    os.system('npm run devStart')

def runPeer():
    os.system('peerjs --port 3001')


server_thread = Thread(target=runServer)
peer_thread = Thread(target=runPeer)


print('[*] Starting Server Thread')
server_thread.start()
print('[*] Starting Peer Thread')
peer_thread.start()
