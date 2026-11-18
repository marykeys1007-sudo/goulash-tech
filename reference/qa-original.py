from playwright.sync_api import sync_playwright
errs=[]; res={}
with sync_playwright() as p:
    b=p.chromium.launch()
    for w,h,name in [(1440,900,'d'),(768,1024,'t'),(375,812,'m'),(320,700,'xs')]:
        pg=b.new_page(viewport={'width':w,'height':h}); pg.on('console',lambda m:errs.append((name,m.text)) if m.type=='error' else None); pg.on('pageerror',lambda e:errs.append((name,str(e))))
        pg.goto('http://localhost:4173/'); pg.wait_for_timeout(600)
        pg.evaluate("document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'))")
        res[name]=pg.evaluate("[document.documentElement.scrollWidth,innerWidth,document.body.scrollHeight]")
        if name in('d','m'):
            for sec in ['product','problems','process','system','demo','segments','pricing','calculator','blog','faq','contact']:
                pg.evaluate(f"document.getElementById('{sec}').scrollIntoView()"); pg.wait_for_timeout(900 if sec=='system' else 350)
                pg.screenshot(path=f'qa/{name}_{sec}.png')
        if name=='d':
            pg.evaluate("document.getElementById('demo').scrollIntoView()")
            pg.select_option('.assign >> nth=0','romanova'); pg.wait_for_timeout(200)
            r1=pg.inner_text('.kpis')
            pg.click('[data-adv]'); pg.click('[data-adv]'); pg.click('[data-adv]'); pg.wait_for_timeout(200)
            r2=pg.inner_text('.kpis'); pg.click('[data-tab=masters]'); r3=pg.inner_text('.kpis'); pg.click('[data-tab=analytics]'); pg.click('[data-period=week]'); r4=pg.inner_text('.kpis')
            pg.click('[data-tab=requests]'); pg.fill('#dq','Мира'); n=pg.locator('.req').count()
            pg.click('#scn'); pg.wait_for_timeout(12500); msg=pg.inner_text('.demo__msg')
            pg.fill('#r-trips','185'); pg.fill('#r-min','42'); pg.fill('#r-rate','2300'); c=pg.inner_text('.calc__out')
            pg.fill('textarea[name=task]','test'); pg.click('#lead button[type=submit]'); f1=pg.inner_text('#lead-status')
            print('KPI1',r1.replace('\n',' '));print('KPI2',r2.replace('\n',' '));print('MAST',r3.replace('\n',' '));print('WEEK',r4.replace('\n',' '));print('search',n);print('scn',msg);print('calc',c.replace('\n',' '));print('form',f1)
        pg.close()
    b.close()
print(res); print('ERR',errs)
