package main

import "fmt"

func add(x, y int) int{
	return x + y
}

func swap(x,y string)(string, string){
	return y, x
}

// the (x,y int) are the local variables for the function
// similar is the case with above function
func split(sum int)(x,y int){
	x = sum * 4 / 9
	y = sum - x
	return
}

func main(){
	a, b := swap("hello", "world")
	fmt.Println(a, b)
	fmt.Println(add(12,13))
	fmt.Println(split(17))

	//un-initialized variables should have there type assigned
	var x, y, z bool
	fmt.Println(x, y, z)
	var i int
	fmt.Println(i)

	// this declaration of variables only works with in the function
	k := 23

	// string(k) converts the type from int to string
	// %T is used to print type on the screen
	// const can also be declared but it can not use := also there is not need to define the type
	// there is only one loop which is for loop

	sum := 1
	for ; sum < 100{
		sum += 1
	}

	fmt.Println(sum)

	// if the conditions in the for loop are removed the loop will run forver
	/*
	   for {

	   }
	   
	*/

	// if statements can also define in scope variables
	/*
	   if v := math.Pow(x, n); v < lim {
		return v
	}

	*/

	
}

