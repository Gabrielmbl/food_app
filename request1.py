import mysql.connector

def connect_db(dbname):
    mydb = mysql.connector.connect(
        host='localhost',
        user='root',
        password='password',
        database=dbname
    )
    return mydb

def hello():
    print('hello')


def add_user(dbname, fname: str, lname: str, password: str):
    if not isinstance(fname, str):
        raise TypeError('First name must be a string.')

    if not isinstance(lname, str):
        raise TypeError('Last name must be a string.')
    
    mydb = connect_db(dbname)
    mycursor = mydb.cursor(dictionary=True)
    sql = ('Insert into users(fname, lname, password) values (%s, %s, %s)')
    val = (fname, lname, password)
    mycursor.execute(sql, val)
    mydb.commit()
    print(mycursor.rowcount, 'record inserted')


def retrieve_users(dbname):
    mydb = connect_db(dbname)
    mycursor = mydb.cursor(dictionary=True)
    mycursor.execute('SELECT * FROM users')

    myresult = mycursor.fetchall()

    for x in myresult:
        print(f"----------\nUser ID: {x['userid']}\nFirst Name: {x['fname']}\nLast Name: {x['lname']}\n----------\n")


def add_plan(dbname, pname: str, num_meals_day: str, price: float, description: str):
    if not isinstance(pname, str):
        raise TypeError('Name must be a string.')

    if not isinstance(price, float):
        raise TypeError('Price must be a double.')
    
    mydb = connect_db(dbname)
    mycursor = mydb.cursor(dictionary=True)
    sql = ('Insert into meal_plans(pname, num_meals_day, price, description) values (%s, %s, %s, %s)')
    val = (pname, num_meals_day, price, description)
    mycursor.execute(sql, val)
    mydb.commit()
    print(mycursor.rowcount, 'record inserted')


def retrieve_plans(dbname):
    mydb = connect_db(dbname)
    mycursor = mydb.cursor(dictionary=True)
    mycursor.execute('SELECT * FROM meal_plans')

    myresult = mycursor.fetchall()

    for x in myresult:
        print(f"----------\nMeal ID: {x['mealid']}\nPlan Name: {x['pname']}\nNumber of Meals a Day: {x['num_meals_day']}\nPrice: {x['price']}\nDescription: {x['description']}\n----------\n")



def del_user(dbname, fname: str, lname: str, password: str):
    if not isinstance(fname, str):
        raise TypeError('First name must be a string.')

    if not isinstance(lname, str):
        raise TypeError('Last name must be a string.')
    
    mydb = connect_db(dbname)
    mycursor = mydb.cursor(dictionary=True)
    sql = ('delete from users where fname = %s and lname = %s and password = %s')
    val = (fname, lname, password)
    mycursor.execute(sql, val)
    mydb.commit()
    print(mycursor.rowcount, 'record deleted')


def del_plan(dbname, pname: str):
    if not isinstance(pname, str):
        raise TypeError('Plan name must be a string.')
   
    mydb = connect_db(dbname)
    mycursor = mydb.cursor(dictionary=True)
    sql = ('delete from meal_plans where pname = %s')
    val = (pname,)
    mycursor.execute(sql, val)
    mydb.commit()
    print(mycursor.rowcount, 'record deleted')


def search_user(dbname, fname):
    mydb = connect_db(dbname)
    mycursor = mydb.cursor(dictionary=True)
    sql = (f"select * from users where fname like '%{fname}%' or lname like '%{fname}%'")
    mycursor.execute(sql)
    myresult = mycursor.fetchall()

    for x in myresult:
        print(f"User ID: {x['userid']}\nFirst Name: {x['fname']}\nLast Name: {x['lname']}")


def search_meal_plan(dbname, pname):
    mydb = connect_db(dbname)
    mycursor = mydb.cursor(dictionary=True)
    sql = ('select * from meal_plans where pname = %s')
    val = (pname,)
    mycursor.execute(sql, val)
    myresult = mycursor.fetchall()

    for x in myresult:
        print(f"Meal Plan ID: {x['mealid']}\nPlan Name: {x['pname']}\nNumber of Meals a day: {x['num_meals_day']}\nPrice: {x['price']}\nDescription: {x['description']}")

def show_menu(dbname='food'):
    mydb = connect_db(dbname)
    mycursor = mydb.cursor(dictionary=True)
    sql = ('select * from menus')
    mycursor.execute(sql)
    myresult = mycursor.fetchall()

    for x in myresult:
        print(f"----------\nName: {x['name']}\nDescription: {x['description']}\nPrice: {x['price']}\n----------\n")


def order_food(fname, lname, mname, dbname='food'):
    mydb = connect_db(dbname)
    mycursor = mydb.cursor(dictionary=True, buffered=True)
    
    # Searching for userid
    sql1 = "SELECT userid FROM users WHERE fname = %s AND lname = %s"
    mycursor.execute(sql1, (fname, lname))
    myresult1 = mycursor.fetchone()
    
    if not myresult1: 
        print(f"User with fname '{fname}' and lname '{lname}' not found.")
        return
    else:
        userid = myresult1['userid']

    # Searching for the food
    sql2 = "SELECT * FROM menus WHERE name = %s"
    mycursor.execute(sql2, (mname,))
    myresult2 = mycursor.fetchone()

    if not myresult2:
        print(f"Menu item with name '{mname}' not found.")
        return 

    food_price = myresult2['price']

    # Getting the menuid
    menuid = myresult2['menuid']


    # Check if the user has an active meal plan
    meal_check_sql = "select * from plan_histories where userid = %s and start_date <= CURDATE() and end_date >= CURDATE() order by end_date desc limit 1"
    mycursor.execute(meal_check_sql, (userid,))
    meal_check_result = mycursor.fetchone()

    if meal_check_result:
        # Check number of meals per day
        mealid = meal_check_result['mealid']
        num_meals_sql = "select * from meal_plans where mealid = %s"
        mycursor.execute(num_meals_sql, (mealid,))
        num_meals_result = mycursor.fetchone()
        num_meals = int(num_meals_result['num_meals_day'])

    
    # Check if an order for the user on the same day exists
    sql3 = "SELECT * FROM orders WHERE userid = %s AND DATE(date) = CURDATE()"
    mycursor.execute(sql3, (userid,))
    myresult3 = mycursor.fetchone()

    
        
    if myresult3:
        print('Found an order made by this user today')
        
        # Getting the orderid
        orderid = myresult3['orderid']

        # Check how many times the person has eaten today
        num_times_sql = "select count(*) as num_times from menus_orders where userid = %s and orderid = %s and date(date) = CURDATE()"
        mycursor.execute(num_times_sql, (userid, orderid))
        num_times_result = mycursor.fetchone()
        num_times = num_times_result['num_times']
        
        # If person has eaten less or equal to the amount that they are able to eat
        if num_times < num_meals:
            # Update the existing order for today's price
            order_sql_update = "UPDATE orders set price = 0 where userid = %s and date(date) = CURDATE()"
            mycursor.execute(order_sql_update, (userid,))
        
        elif num_times >= num_meals:
            # Update the existing order for today's price
            order_sql_update = "update orders set price = price + %s where userid = %s and date(date) = CURDATE()"
            mycursor.execute(order_sql_update, (str(food_price), userid))        


    else:
        print('Did not find an order made by this user today')
              
        # If the person has a meal plan
        if num_meals > 0:
            sql5 = "INSERT INTO orders (userid, price, date) VALUES (%s, 0, NOW())"
            mycursor.execute(sql5, (userid,))
            
        # If the person does not have a meal plan
        else:
            # Create a new order
            sql5 = "INSERT INTO orders (userid, price, date) VALUES (%s, %s, NOW())"
            mycursor.execute(sql5, (userid, food_price))
        
        # Getting the orderid just created
        orderid_sql = "SELECT orderid FROM orders WHERE userid = %s AND DATE(date) = CURDATE()"
        mycursor.execute(orderid_sql, (userid,))
        order_result = mycursor.fetchone()
        orderid = order_result['orderid']

    # Updating menu_orders table
    menus_orders = "insert into menus_orders (orderid, menuid, userid, date) values (%s, %s, %s, NOW())"
    mycursor.execute(menus_orders, (orderid, menuid, userid))
    
    mydb.commit()
    print(mycursor.rowcount, 'record inserted')




while True:
    command = int(input('Choose a command number:\n1: Add new user\n2: Add meal plan\n3: View users\n4: View meal plans\n5: Search users\n6: Search meal plan\n7: Order food\n8: Exit\nCommand: '))

    if command == 1:
        com1 = input('Type your first name: ')
        com2 = input('Type your last name: ')
        com3 = input('Type password: ')
        add_user('food', com1, com2, com3)
        print('--------------------------\n')
    
    if command == 2:
        com1 = input('Type plan name: ')
        com2 = input('Type number of meals a day: ')
        com3 = input('Type price: ')
        com4 = input('Type description: ')
        add_plan('food', com1, com2, com3, com4)
        print('--------------------------\n')

    if command == 3:
        retrieve_users('food')
        print('--------------------------\n')

    if command == 4:
        retrieve_plans('food')
        print('--------------------------\n')

    if command == 5:
        com1 = input('Type your first name or last name: ')
        search_user('food', com1)
        print('--------------------------\n')

    if command == 6:
        com1 = input('Type plan name: ')
        search_meal_plan('food', com1)
        print('--------------------------\n')
    
    if command == 7:
        show_menu()
        com1 = input('Type your name: ')
        com2 = input('Type your last name: ')
        com3 = input('Type the name of what you would like to order: ')
        order_food(com1, com2, com3)
        print('--------------------------\n')
    
    if command == 8:
        print('Exiting')
        break

