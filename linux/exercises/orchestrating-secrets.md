<html>
<head>
    <title></title>
    <link href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' rel='stylesheet' integrity='sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u' crossorigin='anonymous'>
    <link href="../../app.css" rel="stylesheet" >
</head>
<body>
    <nav class="navbar navbar-default">
    <div class="container">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="../../index.html"><img class="logo" src="https://www.docker.com/sites/all/themes/docker/assets/images/brand-full.svg" alt="Docker" title="Docker"/></a>
        </div>
    </div><!-- /.container-fluid -->
    </nav>
    <div class="container">
    <div class="row">
        <h1></h1>
        <div class="content">
            <h1 id="orchestrating-secrets">Orchestrating Secrets</h1>
<p>Orchestrators offer tooling to manage secrets securely, ensuring they are never transmitted or stored unencrypted on disk. In this exercise, we will explore basic secret usage.</p>
<h2 id="prerequisites">Prerequisites</h2>
<ul>
<li>A Swarm with at least one node (<code>docker swarm init</code> on any node with Docker installed will do if you don&#39;t already have a swarm running).</li>
<li>A Kubernetes cluster with at least one master and one worker (see the <strong>Kubernetes</strong> exercise in this book for setup instructions).</li>
</ul>
<h2 id="creating-secrets">Creating Secrets</h2>
<ol>
<li><p>Create a new secret named <code>my-secret</code> with the value <code>abc1234</code> by using the following command to pipe STDIN to the secret value:</p>
<pre><code class="lang-bash">$ echo &#39;abc1234&#39; | docker secret create my-secret -
</code></pre>
<p>Note this won&#39;t work if your machine isn&#39;t in Swarm mode.</p>
</li>
<li><p>Alternatively, secret values can be read from a file. In the current directory create a file called <code>password.txt</code> and add the value <code>my-pass</code> to it. Create a secret with this value:</p>
<pre><code class="lang-bash">$ docker secret create password ./password.txt
</code></pre>
</li>
</ol>
<h2 id="managing-secrets">Managing Secrets</h2>
<p>The Docker CLI provides API objects for managing secrets similar to all other Docker assets:</p>
<ol>
<li><p>List your current secrets:</p>
<pre><code class="lang-bash">$ docker secret ls
</code></pre>
</li>
<li><p>Print secret metadata:</p>
<pre><code class="lang-bash">$ docker secret inspect &lt;secret name&gt;
</code></pre>
</li>
<li><p>Delete a secret:</p>
<pre><code class="lang-bash">$ docker secret rm my-secret
</code></pre>
</li>
</ol>
<h2 id="using-secrets">Using Secrets</h2>
<p>Secrets are assigned to Swarm services upon creation of the service, and provisioned to containers for that service as they spin up.</p>
<ol>
<li><p>Create a service authorized to use the <code>password</code> secret:</p>
<pre><code class="lang-bash">$ docker service create \
    --name demo \
    --secret password \
    alpine:latest ping 8.8.8.8
</code></pre>
</li>
<li><p>Use <code>docker service ps demo</code> to determine what node your service container is running on; ssh into that node, and connect to the container (remember to use <code>docker container ls</code> to find the container ID):</p>
<pre><code class="lang-bash">$ docker container exec -it &lt;container ID&gt; sh
</code></pre>
</li>
<li><p>Inspect the secrets in this container where they are mounted by default, at <code>/run/secrets</code>:</p>
<pre><code class="lang-bash">$ cd /run/secrets
$ ls
$ cat password
$ exit
</code></pre>
<p>This is the <em>only</em> place secret values sit unencrypted in memory.</p>
</li>
</ol>
<h2 id="preparing-an-image-for-use-of-secrets">Preparing an image for use of secrets</h2>
<p>Containers need to consume secrets from their mountpoint, either <code>/run/secrets</code> by default, or a custom mount point if defined. In many cases, existing application logic expects secret values to appear behind environment variables; in the following, we set up such a situation as an example.</p>
<ol>
<li><p>Create a new directory <code>image-secrets</code> and navigate to this folder. In this folder create a file named <code>app.py</code> and add the following content; this is a Python script that consumes a password from a file with a path specified by the environment variable <code>PASSWORD_FILE</code>:</p>
<pre><code class="lang-python">import os
print &#39;***** Docker Secrets ******&#39;
print &#39;USERNAME: {0}&#39;.format(os.environ[&#39;USERNAME&#39;])

fname = os.environ[&#39;PASSWORD_FILE&#39;]
f = open(fname)
try:
    content = f.readlines()
finally:
    f.close()

print &#39;PASSWORD_FILE: {0}&#39;.format(fname)
print &#39;PASSWORD: {0}&#39;.format(content[0])
</code></pre>
</li>
<li><p>Create a file called <code>Dockerfile</code> with the following content:</p>
<pre><code class="lang-bash">FROM python:2.7
RUN mkdir -p /app
WORKDIR /app
COPY . /app
CMD python ./app.py &amp;&amp; sleep 1000
</code></pre>
</li>
<li><p>Build the image and push it to a registry so it&#39;s available to all nodes in your swarm:</p>
<pre><code class="lang-bash">$ docker image build -t &lt;Docker ID&gt;/secrets-demo:1.0 .
$ docker image push &lt;Docker ID&gt;/secrets-demo:1.0
</code></pre>
</li>
<li><p>Create and run a service using this image, and use the <code>-e</code> flag to create environment variables that point to your secrets. Also notice the <code>source</code> and <code>target</code> syntax for attaching a secret, allowing you to alias the secret&#39;s mount point to something other than <code>/run/secrets/&lt;secret name&gt;</code>:</p>
<pre><code class="lang-bash">$ docker service create \
    --name secrets-demo \
    --replicas=1 \
    --secret source=password,target=/custom/path/password,mode=0400 \
    -e USERNAME=&quot;jdoe&quot; \
    -e PASSWORD_FILE=&quot;/custom/path/password&quot; \
    &lt;Docker ID&gt;/secrets-demo:1.0
</code></pre>
</li>
<li><p>Figure out which node your container is running on, head over there, connect to the container, and run <code>python app.py</code>; the <code>-e</code> flag in <code>service create</code> has set environment variables to point at your secrets, allowing your app to find them where it expects.</p>
</li>
</ol>
<h2 id="kubernetes-secrets">Kubernetes Secrets</h2>
<p>Secrets in Kubernetes are manipulated very similarly to Swarm; one interesting difference is the ability to package multiple values or files into the same secret. Below we reproduce the final example from the Swarm section above, but we&#39;ll pass in both the username and password in separate files contained in a single Kubernetes secret, rather than passing the username in directly as an environment variable.</p>
<ol>
<li><p>On your Kubernetes master you set up in the previous exercise, place a username and password in files <code>username</code> and <code>password</code>:</p>
<pre><code class="lang-bash">$ echo &quot;jdoe&quot; &gt; username
$ echo &quot;my-pass&quot; &gt; password
</code></pre>
</li>
<li><p>Create a secret that captures both these files:</p>
<pre><code class="lang-bash">$ kubectl create secret generic user-pass --from-file=./username --from-file=./password
</code></pre>
</li>
<li><p>Create a pod definition in a file <code>secretpod.yaml</code> that uses this secret to map the username file contents directly onto an environment variable, and mount the password file in the container with a second environment variable pointing at its path:</p>
<pre><code class="lang-bash">apiVersion: v1
kind: Pod
metadata:
  name: secretpod
spec:
  containers:
  - name: democon
    image: &lt;Docker ID&gt;/secrets-demo:1.0
    env:
      - name: USERNAME
        valueFrom:
          secretKeyRef:
            name: user-pass
            key: username
      - name: PASSWORD_FILE
        value: &quot;/custom/path/pass&quot;
    volumeMounts:
    - name: passvol
      mountPath: &quot;/custom/path&quot;
      readOnly: true
  volumes:
  - name: passvol
    secret:
      secretName: user-pass
      items:
      - key: password
        path: pass
  restartPolicy: Never
</code></pre>
</li>
<li><p>Spin the pod up, connect a bash shell to it, check that the environment variables are populated as you&#39;d expect and that the python script works correctly:</p>
<pre><code class="lang-bash">$ kubectl create -f secretpod.yaml
$ kubectl exec -it secretpod bash
$ echo $USERNAME
$ echo $PASSWORD_FILE
$ python app.py
</code></pre>
</li>
<li><p>Look in <code>/custom/path</code> inside your running container, and notice that only <code>password</code> is present, mounted as <code>pass</code>. <code>username</code> wasn&#39;t mentioned in the <code>items</code> list for for the <code>user-pass</code> secret, and so wasn&#39;t mounted in the corresponding volume. In this way you can pick and choose which files from a single secret are mounted into a running container.</p>
</li>
<li><p>Compare the config in <code>secretpod.yaml</code> to the last <code>docker service create...</code> command in the last section. Identify the corresponding pieces of syntax between the Swarm and Kubernetes declarations. Where are environment variables declared? How are secrets associated with the service or pod? How do you point an environment variable at a secret mounted in a file?.</p>
</li>
</ol>
<h2 id="conclusion">Conclusion</h2>
<p>In this lab we have learned how to create, inspect and use secrets in both Swarm and Kubernetes. As is often the case, Swarm&#39;s syntax is a bit shorter and simpler, but Kubernetes offers more flexibility and expressiveness, allowing the user to package multiple tokens in a single secret object, and selectively mount them in only the containers that need them.</p>

        </div>        
    </div>
    <div class="row">
        <ul class="mt-article-pagination" style="display:block;">
        </ul>
    </div>
</div>
    <div class="footer"></div>
</body>